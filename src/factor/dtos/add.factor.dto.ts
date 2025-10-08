import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { PaymentStatus, DoneStatus, RejectedStatus } from '../enums/factor.status.enum';

export class CreateFactorDto {
  @ApiProperty({ example: 'COMPLETED', description: 'Payment status', required: true })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty({ example: 'DONE', description: 'Done status', required: true })
  @IsEnum(DoneStatus)
  doneStatus: DoneStatus;

  @ApiProperty({ example: 'NOTREJECT', description: 'Rejected status', required: true })
  @IsEnum(RejectedStatus)
  rejectedStatus: RejectedStatus;

  @ApiProperty({ example: '607f1f77bcf864d799439012', description: 'User ID', required: true })
  @IsMongoId()
  userId: string;
}

