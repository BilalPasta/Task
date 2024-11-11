import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Automatically manages createdAt and updatedAt fields
export class Media {
  @Prop({ required: true, index: true }) // Index for faster lookup by filename
  fileName: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  contentType: string;

  @Prop({ nullable: true })
  description?: string;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ nullable: true })
  size?: number; // Size in bytes

  @Prop({ default: 0 })
  viewCount: number; // Tracks how many times a file has been viewed

  @Prop({ default: null })
  sharableId: string; //

  @Prop({ type: [String], default: [] })
  tags: string[]; // Allows tagging of files for categorization

  @Prop({ nullable: true })
  deletedAt?: Date; // Nullable for soft delete
}

// Mongoose schema for the Media class
export const MediaSchema = SchemaFactory.createForClass(Media);

// Create a type that represents the Media document
export type MediaDocument = Media & Document;
