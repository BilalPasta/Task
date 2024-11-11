import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MediaService } from '../services/media.service';
import { Media } from '../schemas/media.schema';
import { UploadMediaDto } from '../dto/upload-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Media') // Group all endpoints under 'Media' tag in Swagger UI
@Controller('/api/v1/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiOperation({ summary: 'Upload a new media file' })
  @ApiResponse({
    status: 201,
    description: 'The media has been successfully uploaded.',
    type: Media,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or file not provided.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        fileName: { type: 'string', example: 'example.jpg' },
        contentType: { type: 'string', example: 'image/jpeg' },
        description: { type: 'string', example: 'A sample image upload.' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadMediaDto: UploadMediaDto,
  ): Promise<Media> {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    // Set file details in the DTO
    uploadMediaDto.contentType = file.mimetype;

    // Pass file buffer to the service
    return this.mediaService.uploadMedia(uploadMediaDto, file.buffer);
  }

  @ApiOperation({ summary: 'Get a media file by ID' })
  @ApiResponse({
    status: 200,
    description: 'The media has been successfully retrieved.',
    type: Media,
  })
  @ApiResponse({ status: 404, description: 'Media not found.' })
  @ApiParam({ name: 'id', description: 'ID of the media', type: Number })
  @Get(':id')
  async getMedia(@Param('id', ParseIntPipe) id: string): Promise<Media> {
    return this.mediaService.getMedia(id);
  }

  @ApiOperation({
    summary: 'List all media files with optional search and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'The list of media files has been successfully retrieved.',
    type: [Media],
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 10,
    description: 'Maximum number of results to retrieve',
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
    example: 0,
    description: 'Number of results to skip',
  })
  @ApiQuery({
    name: 'searchText',
    type: String,
    required: false,
    example: 'image',
    description: 'Optional search text for filtering results',
  })
  @Get()
  async listMedia(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query('searchText') searchText?: string,
  ): Promise<Media[]> {
    return this.mediaService.listMedia(limit, offset, searchText);
  }

  @ApiOperation({ summary: 'Delete a media file by ID (Soft delete)' })
  @ApiResponse({
    status: 204,
    description: 'The media has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Media not found.' })
  @ApiParam({ name: 'id', description: 'ID of the media', type: Number })
  @Delete(':id')
  async deleteMedia(@Param('id', ParseIntPipe) id: string): Promise<void> {
    return this.mediaService.deleteMedia(id);
  }

  @ApiOperation({ summary: 'Restore a soft-deleted media file by ID' })
  @ApiResponse({
    status: 200,
    description: 'The media has been successfully restored.',
    type: Media,
  })
  @ApiResponse({
    status: 404,
    description: 'Media not found or already restored.',
  })
  @ApiParam({ name: 'id', description: 'ID of the media', type: String })
  @Patch(':id/restore')
  async restoreMedia(@Param('id') id: string): Promise<Media> {
    return this.mediaService.restoreMedia(id);
  }

  @ApiOperation({ summary: 'Update a media file by ID' })
  @ApiResponse({
    status: 200,
    description: 'The media has been successfully updated.',
    type: Media,
  })
  @ApiResponse({ status: 404, description: 'Media not found.' })
  @ApiParam({ name: 'id', description: 'ID of the media', type: Number })
  @Put(':id')
  async updateMedia(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateData: Partial<Media>,
  ): Promise<Media> {
    return this.mediaService.updateMedia(id, updateData);
  }

  @ApiOperation({ summary: 'Get media file by sharableId' })
  @ApiResponse({
    status: 200,
    description: 'The media has been successfully retrieved.',
    type: Media,
  })
  @ApiResponse({ status: 404, description: 'Media not found.' })
  @ApiParam({
    name: 'sharableId',
    description: 'The sharable ID of the media file',
    type: String,
  })
  @Get('sharableId/:sharableId')
  async getMediaBySharableId(
    @Param('sharableId') sharableId: string,
  ): Promise<Media> {
    const media = await this.mediaService.getMediaBySharableId(sharableId);
    if (!media) {
      throw new HttpException('Media not found', HttpStatus.NOT_FOUND);
    }
    return media;
  }
}
