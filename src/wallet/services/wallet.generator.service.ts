// src/wallet/services/testnet-wallet-generator.service.ts
import { Injectable } from '@nestjs/common';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import { ethers } from 'ethers';

@Injectable()
export class TestnetWalletGeneratorService {
  private ECPair = ECPairFactory(ecc);

  /**
   * ساخت کیف پول بیت‌کوین روی Testnet
   */
  generateBitcoinTestnetWallet() {
    // ساخت کلید خصوصی و عمومی
    const keyPair = this.ECPair.makeRandom({ network: bitcoin.networks.testnet });
    const { address } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: bitcoin.networks.testnet
    });

    return {
      network: 'Bitcoin Testnet',
      address,                            // آدرس روی Testnet
      privateKeyWIF: keyPair.toWIF(),     // Private Key در قالب WIF
      privateKeyHex: keyPair.privateKey?.toString('hex'), // Private Key به صورت HEX
      publicKey: keyPair.publicKey.toString('hex') // Public Key
    };
  }

  /**
   * ساخت کیف پول اتریوم روی Sepolia Testnet
   */
  generateEthereumSepoliaWallet() {
    const wallet = ethers.Wallet.createRandom(); // کیف جدید با Mnemonic
    return {
      network: 'Ethereum Sepolia Testnet',
      address: wallet.address,             // آدرس
      privateKey: wallet.privateKey,       // Private Key HEX
      mnemonic: wallet.mnemonic?.phrase,   // عبارت بازیابی 12 کلمه‌ای
      publicKey: wallet.publicKey          // Public Key
    };
  }

  /**
   * ساخت همزمان هر دو کیف پول Testnet (BTC+ETH)
   */
  generateBothTestnetWallets() {
    return {
      bitcoin: this.generateBitcoinTestnetWallet(),
      ethereum: this.generateEthereumSepoliaWallet(),
      createdAt: new Date().toISOString()
    };
  }
}