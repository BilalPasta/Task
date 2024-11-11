import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media, MediaDocument } from '../schemas/media.schema'; // Adjust the import based on your folder structure
import { UploadMediaDto } from '../dto/upload-media.dto';
import { StorageServiceFactory } from '../../storage/storage.service.factory';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private storageService;

  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>, // Inject the Mongoose model for Media
    private readonly storageServiceFactory: StorageServiceFactory,
  ) {
    this.storageService = this.storageServiceFactory.createStorageService();
  }

  /**
   * Upload a new media file.
   * @param uploadMediaDto Contains information about the file to be uploaded.
   * @returns Promise<Media> The uploaded media entity.
   */
  async uploadMedia(uploadMediaDto: UploadMediaDto, buffer): Promise<Media> {
    const { fileName, contentType } = uploadMediaDto;

    // Upload file to storage service (e.g., Cloudinary Storage)
    const uploadedFileUrl = await this.storageService.uploadFile(
      fileName,
      buffer,
      contentType,
    );

    // Create media entity and save in the database
    const media = new this.mediaModel({
      ...uploadMediaDto,
      url: uploadedFileUrl,
      sharableId: uuidv4(),
    });

    return media.save();
  }

  /**
   * Retrieve a media file by its ID.
   * @param id The ID of the media.
   * @returns Promise<Media> The media entity.
   */
  async getMedia(id: string): Promise<Media> {
    const media = await this.mediaModel.findById(id).exec();
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found.`);
    }
    return media;
  }

  /**
   * List all media files with optional search and pagination.
   * @param limit Maximum number of results to retrieve.
   * @param offset Number of results to skip.
   * @param searchText Optional search text for filtering results.
   * @returns Promise<Media[]> An array of media entities.
   */
  async listMedia(
    limit: number,
    offset: number,
    searchText?: string,
  ): Promise<Media[]> {
    const query = searchText
      ? { fileName: { $regex: searchText, $options: 'i' } } // Search by file name with case-insensitive regex
      : {};

    return this.mediaModel.find(query).skip(offset).limit(limit).exec();
  }

  /**
   * Soft delete a media file by its ID.
   * @param id The ID of the media to delete.
   * @returns Promise<void>
   */
  async deleteMedia(id: string): Promise<void> {
    const media = await this.getMedia(id);

    // Delete the file from the storage service (e.g., Azure Blob Storage)
    await this.storageService.deleteFile(media.fileName);

    await this.mediaModel.findByIdAndUpdate(id, { deleted: true }).exec();
  }

  /**
   * Restore a soft-deleted media file by its ID.
   * @param id The ID of the media to restore.
   * @returns Promise<Media> The restored media entity.
   */
  async restoreMedia(id: string): Promise<Media> {
    const media = await this.mediaModel
      .findByIdAndUpdate(id, { deleted: false }, { new: true })
      .exec();
    if (!media) {
      throw new NotFoundException(
        `Media with ID ${id} not found or already restored.`,
      );
    }
    return media;
  }

  /**
   * Update a media file by its ID.
   * @param id The ID of the media to update.
   * @param updateData The data to update the media entity with.
   * @returns Promise<Media> The updated media entity.
   */
  async updateMedia(id: string, updateData: Partial<Media>): Promise<Media> {
    const media = await this.mediaModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found.`);
    }
    return media;
  }

  async findBySharableId(sharableId: string): Promise<Media> {
    return this.mediaModel.findOne({ sharableId }).exec();
  }

  async incrementViewPoint(sharableId: string): Promise<Media> {
    return this.mediaModel.findOneAndUpdate(
      { sharableId },
      { $inc: { viewCount: 1 } },
      { new: true }, // Returns the updated document
    );
  }

  async getMediaBySharableId(sharableId: string): Promise<Media> {
    const media = await this.findBySharableId(sharableId);
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    // Increment viewPoint each time the media is accessed
    await this.incrementViewPoint(sharableId);
    return media;
  }
}
