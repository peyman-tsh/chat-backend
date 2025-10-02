import { IsString, IsEmail, IsPhoneNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';


@ApiSchema({ name: 'CreateCatRequest' })
export class CreateUserDto {
    @ApiProperty({description:'name of the user',example:'John'})
    @IsString({message:'name must be a string'})
    @IsNotEmpty({message:'name is required'})
    name:string;

    @ApiProperty({description:'lastName of the user',example:'Doe'})
    @IsString({message:'lastName must be a string'})
    @IsNotEmpty({message:'lastName is required'})
    lastName:string;

    @ApiProperty({description:'email of the user',example:'john.doe@example.com'})
    @IsEmail({},{message:'email must be a valid email'})
    @IsNotEmpty({message:'email is required'})
    email:string;

    @ApiProperty({description:'phoneNumber of the user',example:'09123456789'})
    @IsPhoneNumber('IR',{message:'phoneNumber must be a valid phone number'})
    phoneNumber:string;

    @ApiProperty({description:'role of the user',example:'admin'})
    @IsString({message:'role must be a string'})
    role:string;
};