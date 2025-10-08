import { CreateWalletDto } from "../dtos/create.wallet.dto";
import { WalletResponseDto } from "../dtos/wallet.response.dto";
import { Wallet } from "../wallet.entity";

export interface ITransferAmountWalletService{
  transferAmountWallet(wallet:CreateWalletDto):Promise<WalletResponseDto>;
}