import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'octatne@gmail.com',
    description: 'Email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Octane@123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
