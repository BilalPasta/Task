// src/media/media.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media } from '../schemas/media.schema'; // Adjust the import based on your folder structure

@Injectable()
export class MediaRepository {
  constructor(@InjectModel(Media.name) private mediaModel: Model<Media>) {}

  /**
   * Upload a new media file.
   * @param media The media entity to be saved.
   * @returns Promise<Media> The saved media entity.
   */
  async uploadMedia(media: Media): Promise<Media> {
    const createdMedia = new this.mediaModel(media);
    return createdMedia.save();
  }

  /**
   * Retrieve a media file by its ID.
   * @param id The UUID of the media.
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
    const query: any = {};

    if (searchText) {
      query.fileName = { $regex: searchText, $options: 'i' }; // Case-insensitive search
    }

    return this.mediaModel.find(query).skip(offset).limit(limit).exec();
  }

  /**
   * Soft delete a media file by its ID.
   * @param id The UUID of the media to delete.
   * @returns Promise<void>
   */
  async softDeleteMedia(id: string): Promise<void> {
    const result = await this.mediaModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException(`Media with ID ${id} not found.`);
    }
  }

  /**
   * Restore a soft-deleted media file by its ID.
   * @param id The UUID of the media to restore.
   * @returns Promise<Media> The restored media entity.
   */
  async restoreMedia(id: string): Promise<Media> {
    const result = await this.mediaModel
      .findByIdAndUpdate(id, { deletedAt: null }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException(
        `Media with ID ${id} not found or already restored.`,
      );
    }
    return result;
  }

  /**
   * Update a media file by its ID.
   * @param id The UUID of the media to update.
   * @param updateData The data to update the media entity with.
   * @returns Promise<Media> The updated media entity.
   */
  async updateMedia(id: string, updateData: Partial<Media>): Promise<Media> {
    const media = await this.mediaModel.findById(id).exec();
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found.`);
    }

    Object.assign(media, updateData);
    return media.save();
  }
}
