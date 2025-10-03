import { CreateUserDto } from "../dtos/create.user.dto";
import { UpdateUserDto } from "../dtos/update.user.dto";
import { User } from "../user.schema";

export interface IUser {
  createUser(user:CreateUserDto):Promise<User>;
  findUserByEmail(email:string):Promise<User>;
  findUserById(id:string):Promise<User>;
  updateUser(id:string,user:UpdateUserDto):Promise<User>;
  deleteUser(id:string):Promise<string>;
  findAllUsers():Promise<User[]>;
  findUserByPhoneNumber(phoneNumber:string):Promise<User>;
  findUserByRole(role:string):Promise<User[]>;
  findUserByRefreshToken(refreshToken:string):Promise<User>;
}