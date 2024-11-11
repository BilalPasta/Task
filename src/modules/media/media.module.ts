// src/media/media.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { MediaService } from './services/media.service';
import { MediaController } from './controllers/media.controller';
import { Media, MediaSchema } from './schemas/media.schema'; // Ensure you export the schema
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]), // Registers Media schema with Mongoose
    StorageModule, // Imports the StorageModule to use its services
  ],
  controllers: [MediaController], // Adds the MediaController
  providers: [MediaService], // Adds MediaService as provider
  exports: [MediaService], // Exports MediaService if needed in other modules
})
export class MediaModule {}
