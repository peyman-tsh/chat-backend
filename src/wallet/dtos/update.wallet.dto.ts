// src/dto/update-wallet.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, IsBoolean } from 'class-validator';

export class UpdateWalletDto {
  @ApiProperty({ example: 1500000, description: 'New balance', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Balance cannot be negative' })
  amount?: number;

  @ApiProperty({ example: true, description: 'Wallet active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: false, description: 'TOTP enabled status', required: false })
  @IsOptional()
  @IsBoolean()
  totpEnabled?: boolean;

  @ApiProperty({ example: 'NEW_TOTP_SECRET', description: 'TOTP secret key', required: false })
  @IsOptional()
  @IsString()
  totpSecret?: string;
}