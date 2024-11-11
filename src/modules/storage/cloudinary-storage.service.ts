// src/storage/cloudinary-storage.service.ts
import { Injectable } from '@nestjs/common';
import cloudinary from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.interface';

@Injectable()
export class CloudinaryStorageService implements StorageService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.v2.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    fileName: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            resource_type: 'auto', // Automatically detect resource type (image, video, etc.)
            public_id: fileName, // Public ID for the file
            content_type: contentType, // Content type (e.g., image/png, image/jpeg)
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result?.secure_url || ''); // Return the secure URL of the uploaded file
            }
          },
        )
        .end(buffer); // Upload the file buffer
    });
  }

  async deleteFile(fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.destroy(fileName, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(); // Successfully deleted the file
        }
      });
    });
  }

  getFileUrl(fileName: string): string {
    // Return the file URL from Cloudinary based on the public ID
    return cloudinary.v2.url(fileName, { secure: true });
  }
}
