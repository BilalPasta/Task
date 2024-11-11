// dto/login-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, {
    message: 'Email must be a valid format with a single domain.',
  })
  email: string;

  @ApiProperty({
    description:
      'Password of the user. Minimum 8 characters, with at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.',
    example: 'Password123!',
  })
  @IsNotEmpty()
  password: string;
}
