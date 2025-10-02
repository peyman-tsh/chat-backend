
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required:true})
  name: string;

  @Prop({required:true,minLength:4})
  lastName: String;

  @Prop({required:true,unique:true})
  email: string;

  @Prop({required:true,unique:true,minlength:11})
  phoneNumber:String

  @Prop()
  role:String

  @Prop({unique:true})
  refreshToken:String
}

export const UserSchema = SchemaFactory.createForClass(User);
