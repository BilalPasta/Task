// src/storage/storage.interface.ts
export interface StorageService {
  uploadFile(
    fileName: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string>;
  deleteFile(fileName: string): Promise<void>;
  getFileUrl(fileName: string): string;
}
