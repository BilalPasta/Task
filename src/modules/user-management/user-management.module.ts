import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './user/users.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './user/users.service';
import { SharedModule } from '../shared/shared.module';
import { User, UserSchema } from './user/schemas/user.schema';
import { UserRepository } from './user/repo/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => SharedModule),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UserManagementModule {}
