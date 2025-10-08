// src/schemas/wallet.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export type WalletDocument = HydratedDocument<Wallet>;

export type CurrencyType = "RLS" | "USD" | "EUR" | "BTC" | "ETH" | "USDT";

@Schema({ timestamps: true })
export class Wallet {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Wallet ID' })
  _id?: string;

  @ApiProperty({ example: 'wlt_abc123def456', description: 'Unique wallet identifier' })
  @Prop({ 
    unique: true, 
    required: true,
    default: () => `wlt_${uuidv4().replace(/-/g, '').substring(0, 16)}`
  })
  unique_id: string;

  @ApiProperty({ example: '1', description: 'Unique wallet sequence_id' })
  @Prop({ 
    unique: true, 
    required: true
  })
  sequence_id: number;

  @ApiProperty({ example: 'usr_abc123def456'})
  @Prop({ required: true , type:mongoose.Schema.Types.ObjectId,ref:"users" })
  userUniqueId: string;

  @ApiProperty({ example: 'RLS', enum: ['RLS', 'USD', 'EUR', 'BTC', 'ETH', 'USDT'] })
  @Prop({ type: String, enum: ['RLS', 'USD', 'EUR', 'BTC', 'ETH', 'USDT'], required: true })
  currency: CurrencyType;

  @ApiProperty({ example: 1500000, description: 'Available balance' })
  @Prop({ required: true, default: 0, min: 0 })
  amount: number;

  @ApiProperty({ example: 50000, description: 'TransferBallance' })
  @Prop({ default: 0, min: 0 })
  transferBalance: number;

  @ApiProperty({ example: 50000, description: 'Frozen/locked balance' })
  @Prop({ default: 0, min: 0 })
  frozenBalance: number;

  @ApiProperty({ example: 'wallet-address-123', description: 'Wallet address' })
  @Prop()
  address?: string;

  @ApiProperty({ example: true, description: 'Wallet active status' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'TOTP enabled status' })
  @Prop({ default: false })
  totpEnabled: boolean;

  @ApiProperty({ example: 'TOTP_SECRET_KEY', description: 'TOTP secret key' })
  @Prop()
  totpSecret?: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);