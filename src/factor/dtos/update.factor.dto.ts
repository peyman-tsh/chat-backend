import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { PaymentStatus, DoneStatus, RejectedStatus } from '../enums/factor.status.enum';

export class UpdateFactorDto {
  @ApiProperty({ example: 'COMPLETED', description: 'Payment status', required: false })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiProperty({ example: 'DONE', description: 'Done status', required: false })
  @IsOptional()
  @IsEnum(DoneStatus)
  doneStatus?: DoneStatus;

  @ApiProperty({ example: 'NOTREJECT', description: 'Rejected status', required: false })
  @IsOptional()
  @IsEnum(RejectedStatus)
  rejectedStatus?: RejectedStatus;

  @ApiProperty({ example: '607f1f77bcf864d799439012', description: 'User ID', required: false })
  @IsOptional()
  @IsMongoId()
  userId?: string;
}