import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'octane@gmail.com',
    required: true,
    nullable: false,
    description: 'User Email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Octane@123',
    required: true,
    nullable: false,
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one upper case letter, one lower case letter, one number, and one special character',
  })
  password: string;
}
