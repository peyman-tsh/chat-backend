// src/wallet/services/signature.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { ethers } from "ethers";
import * as bitcoin from "bitcoinjs-lib";
import { ECPairFactory } from "ecpair";
import * as ecc from "tiny-secp256k1";
import * as bitcoinMessage from "bitcoinjs-message";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";

// Initialize ECPair factory
const ECPair = ECPairFactory(ecc);

export type NetworkType = "ethereum" | "bitcoin";

@Injectable()
export class SignatureService {
  private readonly logger = new Logger(SignatureService.name);

  /**
   * ساخت JWT استاندارد با امضای privateKey
   * این روش JWT معمولی می‌سازه که سرور می‌تونه verify کنه
   */
  async createStandardJWT(
    privateKey: string,
    payload: Record<string, any>,
    expiresIn: string = "1h"
  ): Promise<string> {
    try {
      // برای JWT استاندارد، از privateKey به عنوان secret استفاده می‌کنیم
      // این روش امن‌تره و با کتابخونه‌های JWT سازگاره
      const token = jwt.sign(
        payload,
        privateKey,
        {
          algorithm: "HS256", // HMAC با SHA256
          expiresIn,
          issuer: "wallet-service",
          audience: "pws-api"
        }
      );

      return token;
    } catch (error) {
      this.logger.error("JWT creation failed:", error);
      throw new Error(`Failed to create JWT: ${error.message}`);
    }
  }

  /**
   * ساخت JWT با امضای بلاک‌چین (Custom JWT)
   * این JWT فقط با verify کاستوم کار می‌کنه
   */
  async createBlockchainJWT(
    network: NetworkType,
    privateKey: string,
    payload: Record<string, any>
  ): Promise<string> {
    try {
      // قسمت هدر JWT
      const header = {
        alg: network === "ethereum" ? "ETH" : "BTC",
        typ: "JWT",
        network
      };

      // اضافه کردن زمان و اطلاعات پایه
      const fullPayload = {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // انقضا 1 ساعت
        network
      };

      // تبدیل به base64url
      const headerEncoded = this.base64urlEncode(JSON.stringify(header));
      const payloadEncoded = this.base64urlEncode(JSON.stringify(fullPayload));

      const message = `${headerEncoded}.${payloadEncoded}`;

      let signature: string;
      let address: string;

      if (network === "ethereum") {
        const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
        const wallet = new ethers.Wallet(formattedKey);
        address = wallet.address;
        signature = await wallet.signMessage(message);
      } else {
        const privateKeyBuffer = Buffer.from(privateKey, "hex");
        const keyPair = ECPair.fromPrivateKey(privateKeyBuffer, {
          network: bitcoin.networks.testnet
        });
        
        address = bitcoin.payments.p2pkh({ 
          pubkey: keyPair.publicKey, 
          network: bitcoin.networks.testnet 
        }).address!;

        const sigBuffer = bitcoinMessage.sign(
          message,
          keyPair.privateKey!,
          keyPair.compressed
        );
        signature = sigBuffer.toString("base64");
      }

      // اضافه کردن آدرس به payload برای verify
      fullPayload['address'] = address;
      const updatedPayloadEncoded = this.base64urlEncode(JSON.stringify(fullPayload));

      // تبدیل امضا به base64url
      const signatureEncoded = this.base64urlEncode(signature);

      return `${headerEncoded}.${updatedPayloadEncoded}.${signatureEncoded}`;
    } catch (error) {
      this.logger.error(`Blockchain JWT creation failed:`, error);
      throw new Error(`Failed to create blockchain JWT: ${error.message}`);
    }
  }

  /**
   * Verify کردن JWT استاندارد
   */
  async verifyStandardJWT(token: string, secret: string): Promise<any> {
    try {
      return jwt.verify(token, secret, {
        algorithms: ["HS256"],
        issuer: "wallet-service",
        audience: "pws-api"
      });
    } catch (error) {
      this.logger.error("JWT verification failed:", error);
      throw new Error(`Invalid JWT: ${error.message}`);
    }
  }

  /**
   * Verify کردن Blockchain JWT
   */
  async verifyBlockchainJWT(token: string): Promise<any> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      const [headerEncoded, payloadEncoded, signatureEncoded] = parts;
      
      // Decode header و payload
      const header = JSON.parse(this.base64urlDecode(headerEncoded));
      const payload = JSON.parse(this.base64urlDecode(payloadEncoded));
      const signature = this.base64urlDecode(signatureEncoded);

      // بررسی انقضا
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error("JWT expired");
      }

      // ساخت message برای verify
      const message = `${headerEncoded}.${payloadEncoded}`;

      // Verify امضا بر اساس network
      let isValid = false;
      if (header.network === "ethereum") {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        isValid = recoveredAddress.toLowerCase() === payload.address?.toLowerCase();
      } else if (header.network === "bitcoin") {
        isValid = bitcoinMessage.verify(message, payload.address, signature);
      }

      if (!isValid) {
        throw new Error("Invalid signature");
      }

      return payload;
    } catch (error) {
      this.logger.error("Blockchain JWT verification failed:", error);
      throw new Error(`Invalid blockchain JWT: ${error.message}`);
    }
  }

  /**
   * Helper: تبدیل به base64url
   */
  private base64urlEncode(str: string | Buffer): string {
    const base64 = Buffer.from(str).toString('base64');
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Helper: تبدیل از base64url
   */
  private base64urlDecode(str: string): string {
    str += Array(5 - str.length % 4).join('=');
    str = str
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    return Buffer.from(str, 'base64').toString();
  }

  /**
   * امضا کردن payload بر اساس نوع شبکه
   */
  async signPayload(
    network: NetworkType,
    privateKey: string,
    payload: Record<string, any>
  ): Promise<string> {
    try {
      const payloadString = JSON.stringify(payload);
      this.logger.debug(`Signing payload for ${network} network`);

      if (network === "ethereum") {
        return await this.signEthereumPayload(privateKey, payloadString);
      } else {
        return await this.signBitcoinPayload(privateKey, payloadString);
      }
    } catch (error) {
      this.logger.error(`Signature failed for ${network}:`, error);
      throw new Error(`Failed to sign payload for ${network}: ${error.message}`);
    }
  }

  /**
   * امضای اتریوم با ethers.js
   */
  private async signEthereumPayload(privateKey: string, message: string): Promise<string> {
    const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    const wallet = new ethers.Wallet(formattedKey);
    return await wallet.signMessage(message);
  }

  /**
   * امضای بیت‌کوین با bitcoinjs-message
   */
  private async signBitcoinPayload(privateKey: string, message: string): Promise<string> {
    try {
      const privateKeyBuffer = Buffer.from(privateKey, "hex");
      const keyPair = ECPair.fromPrivateKey(privateKeyBuffer, {
        network: bitcoin.networks.testnet
      });

      const signature = bitcoinMessage.sign(
        message,
        keyPair.privateKey!,
        keyPair.compressed
      );

      return signature.toString("base64");
    } catch (error) {
      this.logger.error(`Bitcoin signature error:`, error);
      throw new Error(`Bitcoin signature failed: ${error.message}`);
    }
  }

  /**
   * تایید امضا
   */
  async verifySignature(
    network: NetworkType,
    message: string,
    signature: string,
    address: string
  ): Promise<boolean> {
    try {
      if (network === "ethereum") {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === address.toLowerCase();
      } else {
        return bitcoinMessage.verify(message, address, signature);
      }
    } catch (error) {
      this.logger.error(`Signature verification failed:`, error);
      return false;
    }
  }

  /**
   * تست کامل JWT و امضاها
   */
  async testJWTAndSignatures(): Promise<{
    standardJWT: boolean;
    ethereumJWT: boolean;
    bitcoinJWT: boolean;
  }> {
    try {
      const testPayload = {
        email: "john.doe@example.com",
        role: ["user", "admin"],
        test: true
      };

      // تست JWT استاندارد
      const privateKeyForStandard = crypto.randomBytes(32).toString('hex');
      const standardToken = await this.createStandardJWT(privateKeyForStandard, testPayload);
      const standardVerified = await this.verifyStandardJWT(standardToken, privateKeyForStandard);
      const standardValid = standardVerified.email === testPayload.email;

      // تست Ethereum JWT
      const ethWallet = ethers.Wallet.createRandom();
      const ethToken = await this.createBlockchainJWT(
        "ethereum",
        ethWallet.privateKey.slice(2),
        testPayload
      );
      const ethVerified = await this.verifyBlockchainJWT(ethToken);
      const ethValid = ethVerified.email === testPayload.email;

      // تست Bitcoin JWT
      const btcKeyPair = ECPair.makeRandom({ network: bitcoin.networks.testnet });
      const btcPrivateKey = btcKeyPair.privateKey!.toString('hex');
      const btcToken = await this.createBlockchainJWT(
        "bitcoin",
        btcPrivateKey,
        testPayload
      );
      const btcVerified = await this.verifyBlockchainJWT(btcToken);
      const btcValid = btcVerified.email === testPayload.email;

      return {
        standardJWT: standardValid,
        ethereumJWT: ethValid,
        bitcoinJWT: btcValid
      };
    } catch (error) {
      this.logger.error(`JWT test failed:`, error);
      return {
        standardJWT: false,
        ethereumJWT: false,
        bitcoinJWT: false
      };
    }
  }
}