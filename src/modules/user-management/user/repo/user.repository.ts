// src/user/user.repository.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { handlePagination } from '@app/common/utils/pagination.util';
import { UserWithCount } from '../interfaces/user-with-count.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByIdAndUpdate(
    id: string,
    updateUserDto: Partial<User>,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true, // return the updated document
      runValidators: true, // validate before update
    });
  }

  async getUserProfile(email: string) {
    return this.userModel.aggregate([
      { $match: { email: email } },

      // Project to exclude the password field
      {
        $project: {
          password: 0, // Exclude the password field
        },
      },
    ]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }); // Without `lean()`
    return user;
  }

  async findById(userId: string): Promise<User | null> {
    // Find the user by ID, limiting the returned fields and populating related fields
    return this.userModel
      .findById(userId)
      .select('name email') // Fields to return
      .exec();
  }

  async findAllUsersWithPagination(
    skip: number,
    take: number,
  ): Promise<UserWithCount> {
    // Change to return the correct type
    const { skip: validSkip, take: validTake } = handlePagination(skip, take);

    // Fetch countries with pagination
    const [items, totalCount] = await Promise.all([
      this.userModel.find({ deletedAt: null }).skip(validSkip).limit(validTake),
      this.count(), // Make sure this.count() returns a number
    ]);

    return { totalCount, items }; // Return an object with both properties
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments({ deletedAt: null }); // Count non-deleted records
  }

  async updateUser(
    userId: string,
    updateUserDto: Partial<User>,
  ): Promise<User> {
    // Filter out undefined properties from updateUserDto
    const updateData = Object.fromEntries(
      Object.entries(updateUserDto).filter(([_, value]) => value !== undefined),
    );

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return updatedUser;
  }
}
