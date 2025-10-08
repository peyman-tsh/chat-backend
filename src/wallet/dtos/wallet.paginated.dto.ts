// src/dto/paginated-wallet-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { WalletResponseDto } from './wallet.response.dto';

export class PaginatedWalletResponseDto {
  @ApiProperty({ type: [WalletResponseDto], description: 'List of wallets' })
  data: WalletResponseDto[];

  @ApiProperty({ example: 25, description: 'Total number of wallets' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;

  @ApiProperty({ example: 3, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Has next page' })
  hasNext: boolean;

  @ApiProperty({ example: false, description: 'Has previous page' })
  hasPrev: boolean;
}