import { ApiProperty } from "@nestjs/swagger";
import { IsOptional , IsString } from "class-validator";


export class UpdateChatDto{
   @ApiProperty({example:"hello", description:"message text", required:false})
   @IsString({message:'message text'}) 
   @IsOptional()
   message:string

}