import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../user-management/user/users.service';

@Injectable()
export class OtpService {
  constructor(
    @Inject(forwardRef(() => UsersService)) // Use forwardRef to handle circular dependency
    private readonly usersService: UsersService,
  ) {}

  generateOtp(type: 'verifyUser' | 'reset' | 'membershipNumber'): string {
    switch (type) {
      case 'verifyUser':
        // Extract the first 6 characters to form a shorter OTP
        const verifyUserOtp = Math.floor(
          100000 + Math.random() * 900000,
        ).toString();
        return verifyUserOtp;

      case 'reset':
        // Extract the first 6 characters to form a shorter OTP
        const resetOtp = uuidv4().replace(/-/g, '').substring(0, 6);
        return resetOtp;

      case 'membershipNumber':
        // Extract the first 6 characters to form a shorter OTP
        const membershipNumber = uuidv4().replace(/-/g, '').substring(0, 6);
        return membershipNumber;
      default:
        throw new Error(`Unsupported OTP type: ${type}`);
    }
  }
}
