import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John', description: 'User first name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Doe', description: 'User last name', required: false, minLength: 4 })
  @IsOptional()
  @IsString()
  @MinLength(4)
  lastName?: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '09123456789', description: 'User phone number', required: false, minLength: 11 })
  @IsOptional()
  @IsString()
  @MinLength(11)
  phoneNumber?: string;

  @ApiProperty({ example: 'user', description: 'User role', required: false, enum: ['admin', 'user'] })
  @IsOptional()
  @IsString()
  role?: string;
}