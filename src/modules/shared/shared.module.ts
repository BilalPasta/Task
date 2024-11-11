import { Module, forwardRef } from '@nestjs/common';
import { PasswordService } from './password.service';
import { OtpService } from './otp.service';
import { UserManagementModule } from '../user-management/user-management.module';
import { StorageServiceFactory } from '../storage/storage.service.factory';
@Module({
  imports: [forwardRef(() => UserManagementModule)],
  providers: [PasswordService, OtpService, StorageServiceFactory],
  exports: [PasswordService, OtpService, StorageServiceFactory],
})
export class SharedModule {}
