// src/dto/wallet-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';


export class WalletResponseDto {
  @ApiProperty({ example: "a78b898c-c999-437f-9102-34c85779340d", description: 'Wallet tracking ID' })
  "tracking_id": string;
  @ApiProperty({ example: 'wallet created', description: 'response message' })
  message:string
}