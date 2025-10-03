import { IsString, IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'UpdateUserRequest' })
export class UpdateUserDto {

    @ApiProperty({
        description:'user id',
        example:''
    })

    @ApiProperty({ 
        description: 'name of the user', 
        example: 'John', 
        required: false 
    })
    @IsString({ message: 'name must be a string' })
    @IsOptional()
    name?: string;

    @ApiProperty({ 
        description: 'lastName of the user', 
        example: 'Doe', 
        required: false 
    })
    @IsString({ message: 'lastName must be a string' })
    @IsOptional()
    lastName?: string;

    @ApiProperty({ 
        description: 'email of the user', 
        example: 'john.doe@example.com', 
        required: false 
    })
    @IsEmail({}, { message: 'email must be a valid email' })
    @IsOptional()
    email?: string;

    @ApiProperty({ 
        description: 'phoneNumber of the user', 
        example: '09123456789', 
        required: false 
    })
    @IsPhoneNumber('IR', { message: 'phoneNumber must be a valid phone number' })
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty({ 
        description: 'role of the user', 
        example: 'admin', 
        required: false 
    })
    @IsString({ message: 'role must be a string' })
    @IsOptional()
    role?: string;
}