import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'User first name', required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Doe', description: 'User last name', required: true, minLength: 4 })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '09123456789', description: 'User phone number', required: true, minLength: 11 })
  @IsNotEmpty()
  @IsString()
  @MinLength(11)
  phoneNumber: string;

  @ApiProperty({ example: 'user', description: 'User role', required: false, enum: ['admin', 'user'] })
  @IsOptional()
  @IsString()
  role?: string;
}