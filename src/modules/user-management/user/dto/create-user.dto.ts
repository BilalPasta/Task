import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  Matches,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';
import { TransformToCase } from '@app/common/decorators/transform-to-case.decorator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional({ message: 'Name is Optional' })
  readonly name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Must be a valid email address' })
  @TransformToCase('lower') // Ensures email is stored in lowercase
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, {
    message: 'Email must be a valid format with a single domain.',
  })
  email: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'The password of the user. Must be between 8 and 20 characters, contain at least one uppercase letter, one number, and one special character.',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, {
    message:
      'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one digit, and one special character.',
  })
  password: string;
}
