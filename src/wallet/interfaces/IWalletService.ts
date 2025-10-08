import { CreateWalletDto } from "../dtos/create.wallet.dto";
import { UpdateWalletDto } from "../dtos/update.wallet.dto";
import { Wallet } from "../wallet.entity";

export interface IWalletService{
  createWallet(wallet:CreateWalletDto):Promise<Wallet>;
  updateWallet(id:string,wallet:UpdateWalletDto):Promise<Wallet>;
  deleteWalletById(id:string):Promise<Wallet>;
}