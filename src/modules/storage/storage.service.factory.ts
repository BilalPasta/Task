// src/storage/storage.service.factory.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.interface';
import { CloudinaryStorageService } from './cloudinary-storage.service';
@Injectable()
export class StorageServiceFactory {
  constructor(private readonly configService: ConfigService) {}

  createStorageService(): StorageService {
    const provider = this.configService.get<string>('STORAGE_PROVIDER');

    switch (provider) {
      case 'azure':
      // return new AzureBlobStorageService(this.configService);
      case 'cloudinary':
        return new CloudinaryStorageService(this.configService);
      default:
        throw new Error('Unsupported storage provider');
    }
  }
}
