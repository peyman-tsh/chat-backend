// src/wallet/services/wallet.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { IWalletService } from "../interfaces/IWalletService";
import { CreateWalletDto } from "../dtos/create.wallet.dto";
import { UpdateWalletDto } from "../dtos/update.wallet.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Wallet } from "../wallet.entity";
import { Model } from "mongoose";

@Injectable()
export class WalletService implements IWalletService {
    constructor(
        @InjectModel(Wallet.name) private readonly walletRepo: Model<Wallet>
    ) {}

    async createWallet(wallet: CreateWalletDto): Promise<Wallet> {
        const createWallet = await this.walletRepo.create(wallet);
        
        // افزایش sequence_id برای همه رکوردها
        await this.walletRepo.updateMany({}, {
            $inc: { sequence_id: 1 }
        });
        
        return createWallet;
    }

    async updateWallet(id: string, wallet: UpdateWalletDto): Promise<Wallet> {
        const updateWallet = await this.walletRepo.findByIdAndUpdate(id, wallet, { new: true });
        if (!updateWallet) {
            throw new NotFoundException('Wallet not found for update');
        }
        return updateWallet;
    }

    async deleteWalletById(id: string): Promise<Wallet> {
        const deleteWalletById = await this.walletRepo.findByIdAndDelete(id);
        if (!deleteWalletById) {
            throw new NotFoundException('Wallet not found for deletion');
        }
        return deleteWalletById;
    }

    // متدهای اضافی که کنترلر نیازشون داره
    async getAllWallets(options?: { page?: number; limit?: number; userId?: string }): Promise<Wallet[]> {
        const query = options?.userId ? { userUniqueId: options.userId } : {};
        const limit = options?.limit || 10;
        const skip = options?.page ? (options.page - 1) * limit : 0;
        
        return await this.walletRepo.find(query).limit(limit).skip(skip).exec();
    }

    async getWalletById(id: string): Promise<Wallet> {
        const wallet = await this.walletRepo.findById(id);
        if (!wallet) {
            throw new NotFoundException(`Wallet with ID ${id} not found`);
        }
        return wallet;
    }

    async getUserWallets(userId: string, network?: 'ethereum' | 'bitcoin'): Promise<Wallet[]> {
        const query: any = { userUniqueId: userId };
        if (network) {
            query.network = network;
        }
        return await this.walletRepo.find(query).exec();
    }

    async getUserTotalBalance(userId: string): Promise<{
        ethereum: { balance: number; currency: string };
        bitcoin: { balance: number; currency: string };
        total_wallets: number;
    }> {
        const wallets = await this.getUserWallets(userId);
        
        return {
            ethereum: { balance: 0, currency: 'ETH' }, // باید از API واقعی بگیری
            bitcoin: { balance: 0, currency: 'BTC' },   // باید از API واقعی بگیری
            total_wallets: wallets.length
        };
    }
}