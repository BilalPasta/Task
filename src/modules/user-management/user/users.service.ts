import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from '../../shared/password.service';
import { User } from './schemas/user.schema';
import { UserRepository } from './repo/user.repository';
import { OtpService } from '../../shared/otp.service';

import { AuthService } from '../../auth/services/auth.service';

interface UserWithCount {
  totalCount: number;
  items: User[];
}

@Injectable()
export class UsersService {
  // private winstonLogger;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>, // Injecting the Mongoose model
    private readonly userRepo: UserRepository, // Inject CountryRepository
    @Inject(forwardRef(() => OtpService)) // Use forwardRef to handle circular dependency
    private readonly otpService: OtpService,

    private readonly passwordService: PasswordService,
    @Inject(forwardRef(() => AuthService)) // Use forwardRef to handle circular dependency
    private readonly authService: AuthService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, name } = createUserDto;
    // Check if user already exists
    const existingUser = await this.userRepo.findByEmail(email);

    if (existingUser) {
      throw Error('Email already Exist');
    }

    const hashPassword = await this.passwordService.hashPassword(password);

    // Create new user with pending status
    const newUser = await this.userRepo.create({
      email: email,
      password: hashPassword,
      name: name,
    });

    return {
      message: 'Account succuessfully created',
    };
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findByEmail(email); // Using Mongoose query
  }

  async getUserProfile(email: string) {
    return this.userRepo.getUserProfile(email);
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.userRepo.findById(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findByEmail(email); // Using Mongoose query
  }

  async findAllWithPagination(
    skip?: number,
    take?: number,
  ): Promise<UserWithCount> {
    return this.userRepo.findAllUsersWithPagination(skip, take);
  }
}
