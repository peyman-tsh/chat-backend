// src/wallet/services/transferAmount.wallet.service.ts
import { Injectable, Logger, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import { ITransferAmountWalletService } from "../interfaces/ITransferAmountWallet";
import { CreateWalletDto } from "../dtos/create.wallet.dto";
import { WalletResponseDto } from "../dtos/wallet.response.dto";
import { TransferRequestDto } from "../dtos/transfer.request.dto";
import { WalletService } from "./wallet.service";
import { TestnetWalletGeneratorService } from "./wallet.generator.service";
import { SignatureService } from "./signature.service";
import { PayloadBuilderService } from "./payload.bulider.service";
import fs from 'fs';
import * as crypto from 'crypto';
import * as jwt from "jsonwebtoken";

export type NetworkType = "ethereum" | "bitcoin";

export interface WalletCredentials {
  address: string|undefined;
  privateKey: string;
  network: NetworkType;
}

@Injectable()
export class TransferAmountWalletService implements ITransferAmountWalletService {
  private readonly logger = new Logger(TransferAmountWalletService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly walletService: WalletService,
    private readonly testnetWalletService: TestnetWalletGeneratorService,
    private readonly signatureService: SignatureService,
    private readonly payloadBuilderService: PayloadBuilderService,
    private readonly service:TestnetWalletGeneratorService
  ) {}

  /**
   * انتقال مبلغ با استفاده از کیف پول
   */
 async transferAmountWallet(
  wallet: CreateWalletDto,
  transferRequest?: TransferRequestDto
): Promise<WalletResponseDto> {
  try {
    this.logger.log(`Starting wallet transfer for unique_id: ${wallet.userUniqueId}`);

    // 1. ساخت رکورد کیف در دیتابیس
    const createWallet = await this.walletService.createWallet(wallet);

    // 2. تعیین شبکه (پیش‌فرض Ethereum)
    const network: NetworkType = transferRequest?.network || "ethereum";

    // 3. گرفتن اطلاعات کیف (آدرس و privateKey واقعی کاربر این کیف)
    const walletCredentials = await this.getWalletCredentials(network);

    // 4. ساخت payload انتقال
    const basePayload = this.payloadBuilderService.buildTransferPayload(
      createWallet,
      walletCredentials,
      transferRequest
    );

    // 5. امضا کردن payload با privateKey کیف واقعی
    const payloadSignature = await this.signatureService.signPayload(
      network,
      walletCredentials.privateKey,
      basePayload
    );

    // 6. ساخت JWT معتبر با امضای بلاک‌چین برای Authorization
    const token = await this.signatureService.createBlockchainJWT(
      network,
      walletCredentials.privateKey,
      { ...basePayload, payload: payloadSignature }
    );

    // 7. بدنه نهایی که به API می‌فرستیم
    const finalBody = {
      serviceId: transferRequest?.network || "IRC-TEST",
      data: {
        ...basePayload,
        payload: payloadSignature
      }
    };

    this.logger.debug(`Sending request to API with payload: ${JSON.stringify(finalBody, null, 2)}`);

    // 8. ارسال درخواست به Wallet API
    const response = await this.sendTransferRequest(finalBody, token);

    this.logger.log(`Transfer completed successfully for unique_id: ${createWallet.unique_id}`);

    return response;

  } catch (error) {
    this.logger.error(`Transfer failed: ${error.message}`, error.stack);

    if (error instanceof AxiosError) {
      throw new BadRequestException(`API Error: ${error.response?.data?.message || error.message}`);
    }

    throw new InternalServerErrorException(`Transfer failed: ${error.message}`);
  }
}

  /**
   * دریافت اطلاعات کیف پول بر اساس شبکه
   */
  private async getWalletCredentials(network: NetworkType): Promise<WalletCredentials> {
    try {
      if (network === "ethereum") {
        const ethWallet = this.testnetWalletService.generateEthereumSepoliaWallet();
        return {
          address: ethWallet.address,
          privateKey: ethWallet.privateKey.replace(/^0x/, ""),
          network: "ethereum"
        };
      } else {
        const btcWallet = this.testnetWalletService.generateBitcoinTestnetWallet();
        return {
          address: btcWallet.address,
          privateKey: btcWallet.privateKeyHex,
          network: "bitcoin"
        };
      }
    } catch (error) {
      this.logger.error(`Failed to generate wallet credentials for ${network}:`, error);
      throw new InternalServerErrorException(`Failed to generate ${network} wallet`);
    }
  }

  /**
   * ارسال درخواست انتقال به API
   */
  private async sendTransferRequest(payload: any,token:string): Promise<WalletResponseDto> {
    console.log(token);
    
    try {
      const response = await firstValueFrom(
        this.httpService.post("https://main.pws.plzdev.ir/action", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          timeout: 30000 // 30 second timeout
        })
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`API request failed: ${error.response?.status} - ${error.response?.statusText}`);
        this.logger.error(`Response data:`, error.response?.data);
      }
      throw error;
    }
  }

  /**
   * تست اتصال به API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get("https://main.pws.plzdev.ir/health", {
          headers: {
            Authorization: `Bearer ${process.env.PWS_API_TOKEN}`
          },
          timeout: 10000
        })
      );
      return response.status === 200;
    } catch (error) {
      this.logger.warn(`API connection test failed:`, error.message);
      return false;
    }
  }

  // اضافه کردن متد getWalletBalance
async getWalletBalance(
    walletId: string, 
    network?: 'ethereum' | 'bitcoin'
): Promise<{ balance: number; currency: string; network: string }> {
    try {
        const wallet = await this.walletService.getWalletById(walletId);
        const credentials = await this.getWalletCredentials(network || 'ethereum');
        
        // اینجا باید API واقعی رو صدا بزنی برای گرفتن موجودی
        const balancePayload = {
            action: "get_balance",
            address: credentials.address,
            network: network || 'ethereum'
        };

        const response = await firstValueFrom(
            this.httpService.post("https://main.pws.plzdev.ir/balance", balancePayload, {
                headers: {
                    Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3NTk4NzA0OTUsImV4cCI6MTc5MTQwNjQ5NSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.i0jvxwfA0YNnqP3bLFzJ0aXM_YqEquLLY5wCGpAb4WU`,
                    "Content-Type": "application/json"
                }
            })
        );

        return {
            balance: response.data.balance || 0,
            currency: network === 'bitcoin' ? 'BTC' : 'ETH',
            network: network || 'ethereum'
        };
    } catch (error) {
        this.logger.error(`Failed to get balance for wallet ${walletId}:`, error);
        return {
            balance: 0,
            currency: network === 'bitcoin' ? 'BTC' : 'ETH',
            network: network || 'ethereum'
        };
    }
}



async sendData() {
  // خواندن کلید خصوصی ولت
  const privateKeyPem = fs.readFileSync('./src/wallet/private_key.pem', 'utf8');

  // داده اصلی مطابق اطلاعات Wallet
  const dataToSign = {
  userUniqueId: 'IRC-TEST',
  serviceId:"IRC-TEST",
  sequence_id: 1,
  action: 'create',
  data: {
    from: 'IRC-TEST-user',
    to: 'IRC-TEST',
    amount: 45000,
    currency: 'IRR',
    callback: 'http://callback.com/v1/s-2',
    reference: 'binance--0.03btc--Sell ',
  },
  time: '2022-11-15T08:30:00Z',
};

  // ساخت امضا از داده‌ها با الگوریتم RSA-SHA256
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(JSON.stringify(dataToSign));
  signer.end();
  const signatureBase64 = signer.sign(
    { key: privateKeyPem, passphrase: 'wallet_password' },
    'base64'
  );

  // بدنه نهایی درخواست
  const requestBody = {
    ...dataToSign,
    payload: signatureBase64 // اضافه کردن امضا
  };

  console.log('📩 payload signature:', signatureBase64);

  // ارسال به API Wallet
  const response = await firstValueFrom(
    this.httpService.post('https://main.pws.plzdev.ir/action', requestBody, {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: 'test-developers', // یوزرنیم ولت
        password: '237v3YZv7gqGt4E6' // پسورد ولت
      }
    })
  );

  return response.data;
}
}