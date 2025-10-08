// src/wallet/services/payload.builder.service.ts
import { Injectable } from "@nestjs/common";
import { WalletCredentials } from "./transferAmount.wallet.service";
import { TransferRequestDto } from "../dtos/transfer.request.dto";

@Injectable()
export class PayloadBuilderService {

  /**
   * ساخت payload برای انتقال
   */
  buildTransferPayload(
    walletRecord: any,
    credentials: WalletCredentials,
    transferRequest?: TransferRequestDto
  ): Record<string, any> {
    const nowUtc = new Date().toISOString();

    return {
      unique_id: walletRecord.unique_id,
      sequence_id: walletRecord.sequence_id,
      action: transferRequest?.action || "create",
      data: {
        from: credentials.address,
        to: this.getDefaultDestination(credentials.network, transferRequest?.to),
        amount: transferRequest?.amount || 45000,
        currency: transferRequest?.currency || "RLS",
        callback: `http://callback.com/v1/${walletRecord.unique_id}`,
        reference: transferRequest?.reference || `${credentials.network}--transfer--${Date.now()}`
      },
      time: nowUtc
    };
  }

  /**
   * آدرس مقصد پیش‌فرض بر اساس شبکه
   */
  private getDefaultDestination(network: string, customTo?: string): string {
    if (customTo) return customTo;

    return network === "ethereum"
      ? "0x7eB62A2F1E76f8a2eC8cB9BaF6611B76f05e1aF2"
      : "tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"; // Bitcoin testnet address
  }
}