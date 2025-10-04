import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty , IsString } from "class-validator"



export class CreateChatDto{
    @ApiProperty({example:"507f1f77bcf86cd799439011",description:'sender user id',required:true})
    @IsNotEmpty({message:'user id required'})
    @IsString({message:"must be string"})
    sendeUserId:string


    @ApiProperty({example:"507f1f77bcf86cd799439011",description:'recive user id',required:true})
    @IsNotEmpty({message:'user id required'})
    @IsString({message:"must be string"})
    ReciveUserId:string

    @ApiProperty({example:"hello!",description:'message text detail',required:true})
    @IsNotEmpty({message:'message required'})
    @IsString({message:"must be string"})
    message:string
}