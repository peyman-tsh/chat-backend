import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaymentStatus , RejectedStatus , DoneStatus } from './enums/factor.status.enum';
import { ApiProperty } from '@nestjs/swagger';

export type FactorSchema = HydratedDocument<Factor>;

@Schema()
export class Factor {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The auto-generated MongoDB ID' })
  _id?: string;

  @ApiProperty({ example: 'COMPLETED',enum:PaymentStatus, description: 'payment status is compeleted or not', required: true })
  @Prop({required: true,enum:PaymentStatus,index:true,default:"COMPLETED"})
  paymentStatus:string;

  @ApiProperty({ example: 'DONE',enum:DoneStatus, description: 'done status by default is DONE', required: true})
  @Prop({required: true,index:true ,enum:DoneStatus,default:"DONE" })
  doneStatus : string;

  @ApiProperty({ example: 'NOTREJECTED', enum:RejectedStatus,description: 'rejected status for callback on shepa payment', required: true })
  @Prop({required: true,enum:RejectedStatus,default:RejectedStatus.NOTREJECT})
  rejectedStatus: string;

  @ApiProperty({ example: '607f1f77bcf864d799439012', description: 'User id' })
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"users"})
  userId:string

}

export const FactorSchema = SchemaFactory.createForClass(Factor);