// src/wallet/dtos/transfer.request.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export enum NetworkType {
  ETHEREUM = "ethereum",
  BITCOIN = "bitcoin"
}

export enum TransferAction {
  CREATE = "create",
  UPDATE = "update",
  CANCEL = "cancel"
}

export class TransferRequestDto {
  @ApiPropertyOptional({
    enum: NetworkType,
    default: NetworkType.ETHEREUM,
    description: "نوع شبکه بلاک‌چین"
  })
  @IsOptional()
  @IsEnum(NetworkType)
  network?: NetworkType;

  @ApiPropertyOptional({
    enum: TransferAction,
    default: TransferAction.CREATE,
    description: "نوع عملیات"
  })
  @IsOptional()
  @IsEnum(TransferAction)
  action?: TransferAction;

  @ApiPropertyOptional({
    example: "0x7eB62A2F1E76f8a2eC8cB9BaF6611B76f05e1aF2",
    description: "آدرس مقصد"
  })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({
    example: 45000,
    minimum: 1,
    description: "مبلغ انتقال"
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @ApiPropertyOptional({
    example: "RLS",
    description: "نوع ارز"
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    example: "binance--0.03btc--Sell",
    description: "مرجع تراکنش"
  })
  @IsOptional()
  @IsString()
  reference?: string;
}