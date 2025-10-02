import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Model } from "mongoose";
import { IUser } from "./interfaces/IUser";
import { CreateUserDto } from "./dtos/create.user.dto";


export class UserService implements IUser{
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}
    async createUser(user: CreateUserDto): Promise<User> {
        const newUser = new this.userModel(user);
        newUser.save();
        return newUser;
    }
    async  findUserByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({email});
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user
    }
    async findUserById(id: string): Promise<User> {
        const user = await this.userModel.findById(id);
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user
    }
    async updateUser(id: string, user: CreateUserDto): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {new:true});
        if(!updatedUser){
            throw new NotFoundException('User not found');
        }
        return updatedUser
    }
    async deleteUser(id: string): Promise<void> {
        const deletedUser = await this.userModel.findByIdAndDelete(id);
        if(!deletedUser){
            throw new NotFoundException('User not found');
        }
    }
    async findAllUsers(): Promise<User[]> {
        const users = await this.userModel.find();
        if(!users){
            throw new NotFoundException('Users not found');
        }
        return users
    }
    async findUserByPhoneNumber(phoneNumber: string): Promise<User> {
        const user = await this.userModel.findOne({phoneNumber});
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user
    }
 

    async findUserByRefreshToken(refreshToken: string): Promise<User> {
        const user = await this.userModel.findOne({refreshToken});
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user
    }
    async findUserByRole(role: string): Promise<User[]> {
        const users = await this.userModel.find({role});
        if(!users){
            throw new NotFoundException('Users not found');
        }
        return users
    }


}