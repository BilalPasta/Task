// src/storage/storage.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageServiceFactory } from './storage.service.factory';
import { AzureBlobStorageService } from './azure-blob-storage.service';
// import { AwsS3StorageService } from './aws-s3-storage.service'; // Uncomment if AWS is used

@Module({
  imports: [ConfigModule], // Import the ConfigModule to access environment variables
  providers: [
    StorageServiceFactory,
    AzureBlobStorageService,
    // AwsS3StorageService, // Uncomment if AWS is used
  ],
  exports: [StorageServiceFactory], // Export StorageServiceFactory to be used in other modules
})
export class StorageModule {}
