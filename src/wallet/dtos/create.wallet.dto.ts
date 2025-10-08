// src/dto/create-wallet.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, Min, IsBoolean } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({ example: 'usr_abc123def456', description: 'Owner user unique ID' })
  @IsString()
  userUniqueId: string;

  @ApiProperty({ example: 'RLS', enum: ['RLS', 'USD', 'EUR', 'BTC', 'ETH', 'USDT'], description: 'Wallet currency' })
  @IsEnum(['RLS', 'USD', 'EUR', 'BTC', 'ETH', 'USDT'])
  currency: string;

  @ApiProperty({ example: 1000000, description: 'Initial balance (optional)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Balance cannot be negative' })
  amount?: number;

  @ApiProperty({ example: 'wallet-address-123', description: 'Wallet address (optional - auto-generated if not provided)', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: true, description: 'Wallet active status (optional)', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}