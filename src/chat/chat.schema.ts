import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The auto-generated MongoDB ID' })
  _id?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'sender User id', required: true })
  @Prop({required: true,index:true,type: mongoose.Schema.Types.ObjectId, ref: 'users'})
  sendeUserId: string;

  @ApiProperty({ example: '607f1f77bcf864d799439012', description: 'User recive Id', required: true})
  @Prop({required: true,index:true,type: mongoose.Schema.Types.ObjectId, ref: 'users'})
  ReciveUserId: String;

  @ApiProperty({ example: 'message example : hi', description: 'message between two users', required: true })
  @Prop({required: true})
  message: string;

}

export const ChatSchema = SchemaFactory.createForClass(Chat);