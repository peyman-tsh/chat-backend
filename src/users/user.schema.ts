import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'The auto-generated MongoDB ID' })
  _id?: string;

  @ApiProperty({ example: 'John', description: 'User first name', required: true })
  @Prop({required: true})
  name: string;

  @ApiProperty({ example: 'Doe', description: 'User last name', required: true, minLength: 4 })
  @Prop({required: true, minLength: 4})
  lastName: String;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address', required: true })
  @Prop({required: true, unique: true})
  email: string;

  @ApiProperty({ example: '09123456789', description: 'User phone number', required: true, minLength: 11 })
  @Prop({required: true, unique: true, minlength: 11})
  phoneNumber: String;

  @ApiProperty({ example: 'user', description: 'User role', enum: ['admin', 'user'] })
  @Prop()
  role: String;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'User refresh token' })
  @Prop()
  refreshToken: String;
}

export const UserSchema = SchemaFactory.createForClass(User);