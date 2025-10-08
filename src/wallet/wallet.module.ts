// src/wallet/wallet.module.ts
import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./services/wallet.service";
import { TransferAmountWalletService } from "./services/transferAmount.wallet.service";
import { TestnetWalletGeneratorService } from "./services/wallet.generator.service";
import { SignatureService } from "./services/signature.service";
import { PayloadBuilderService } from "./services/payload.bulider.service";
import { Wallet ,WalletSchema } from "./wallet.entity";
import { TestnetWalletController } from "./wallet.generator.controller";

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema }
    ])
  ],
  controllers: [WalletController,TestnetWalletController],
  providers: [
    WalletService,
    TransferAmountWalletService,
    TestnetWalletGeneratorService,
    SignatureService,
    PayloadBuilderService
  ],
  exports: [
    WalletService,
    TransferAmountWalletService,
    TestnetWalletGeneratorService,
    SignatureService
  ]
})
export class WalletModule {}