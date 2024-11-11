// src/storage/azure-blob-storage.service.ts
import { Injectable } from '@nestjs/common';
import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.interface';

@Injectable()
export class AzureBlobStorageService implements StorageService {
  private readonly containerClient: ContainerClient;

  constructor(private readonly configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      'AZURE_STORAGE_CONNECTION_STRING',
    );
    const containerName = this.configService.get<string>(
      'AZURE_STORAGE_CONTAINER_NAME',
    );

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = blobServiceClient.getContainerClient(containerName);
  }

  async uploadFile(
    fileName: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string> {
    const blockBlobClient: BlockBlobClient =
      this.containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: contentType,
      },
    });
    return this.getFileUrl(fileName);
  }

  async deleteFile(fileName: string): Promise<void> {
    const blockBlobClient: BlockBlobClient =
      this.containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.deleteIfExists();
  }

  getFileUrl(fileName: string): string {
    return `${this.containerClient.url}/${fileName}`;
  }
}
