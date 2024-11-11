import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../user-management/user/users.service';
import { LoginUserDto } from '.././dto/login-user.dto';
import { PasswordService } from '../../shared/password.service';
import { OtpService } from '../../shared/otp.service';

import moment from 'moment';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService)) // Use forwardRef for circular dependency
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly otpService: OtpService,
  ) {}

  async validateUserCredentials(email: string, password: string): Promise<any> {
    let user = await this.usersService.findByEmail(email);
    if (
      user &&
      user?.password &&
      (await this.passwordService.comparePassword(password, user.password))
    ) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginUserDto): Promise<any> {
    // Validate user credentials
    const user = await this.validateUserCredentials(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Fetch full user data with associations (company and role)
    const fullUserProfile = await this.usersService.getUserProfile(
      loginDto.email,
    );

    if (!fullUserProfile || fullUserProfile.length === 0) {
      throw new UnauthorizedException('User profile not found');
    }

    const userWithRolesAndCompanies = fullUserProfile[0];

    // Generate access token and add it to the user object
    const accessToken = this.generateToken(userWithRolesAndCompanies);
    userWithRolesAndCompanies.access_token = accessToken;

    return userWithRolesAndCompanies;
  }

  private generateToken(user: any) {
    const payload = {
      first_name: user.first_name,
      last_name: user.last_name,
      sub: user.id,
      email: user.email,
      is_admin: user.isAdmin,
    };
    return this.jwtService.sign(payload);
  }

  // these service is for email verification

  // Generate a token with a 5-minute expiry
  generateVerificationToken(user: any, otp: string): string {
    const payload = {
      sub: user.id,
      email: user.email,
      otp, // Embed the OTP for verification in the token
    };
    return this.jwtService.sign(payload, {
      expiresIn: '5m', // Set token expiry time to 5 minutes
    });
  }

  verifyToken(token: string): { isValid: boolean; expiry?: string } {
    try {
      // Verify the token; if valid and not expired, it will return the decoded payload
      const decoded = this.jwtService.verify(token);
      // If valid, get the expiration time from the 'exp' claim and format as ISO
      const expiryDate = moment.unix(decoded.exp).toISOString(); // Format as ISO 8601
      return { isValid: true, expiry: expiryDate }; // Return validity and ISO formatted expiry date
    } catch (error) {
      // If verification fails, this includes expired tokens
      return { isValid: false }; // Return false if token is invalid or expired
    }
  }
}
