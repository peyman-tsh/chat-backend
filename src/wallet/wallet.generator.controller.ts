// src/wallet/controllers/testnet-wallet.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TestnetWalletGeneratorService } from './services/wallet.generator.service';

@ApiTags('Testnet Wallet Generator')
@Controller('api/testnet-wallet')
export class TestnetWalletController {
  constructor(private readonly generator: TestnetWalletGeneratorService) {}

  @Get('bitcoin')
  @ApiOperation({ summary: 'Generate Bitcoin Testnet Wallet' })
  @ApiResponse({ status: 200 })
  generateBitcoinWallet() {
    return this.generator.generateBitcoinTestnetWallet();
  }

  @Get('ethereum')
  @ApiOperation({ summary: 'Generate Ethereum Sepolia Wallet' })
  @ApiResponse({ status: 200 })
  generateEthereumWallet() {
    return this.generator.generateEthereumSepoliaWallet();
  }

  @Get('both')
  @ApiOperation({ summary: 'Generate Both Bitcoin & Ethereum Testnet Wallets' })
  @ApiResponse({ status: 200 })
  generateBothWallets() {
    return this.generator.generateBothTestnetWallets();
  }
}