import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReplaceSpaces } from '@app/common/decorators/replace-spaces.decorator';

export class UploadMediaDto {
  @ApiProperty({
    description: 'The name of the file to be uploaded',
    example: 'example.jpg',
  })
  @IsOptional() // Optional because it will be set later
  @IsString()
  @ReplaceSpaces('-')
  fileName?: string;

  @ApiProperty({
    description: 'The MIME type of the file',
    example: 'image/jpeg',
  })
  @IsOptional() // Optional because it will be set later
  @IsString()
  contentType?: string;

  @ApiProperty({
    description: 'Optional description for the media file',
    example: 'A sample image upload.',
    required: false,
  })
  @IsOptional() // Optional because it will be set later
  @IsString()
  description?: string;
}
