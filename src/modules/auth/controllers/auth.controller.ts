import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { Response } from 'express'; // Import Express Response

@ApiTags('Auth')
@Controller('/api/v1/user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully.',
    type: LoginUserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: LoginUserDto })
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response, // Use NestJS response object
  ) {
    const user = await this.authService.login(loginDto);

    // Set the cookie
    // res.cookie('accessToken', user.access_token, {
    //   httpOnly: true, // Prevents access from JavaScript
    //   secure: process.env.NODE_ENV === 'production', // Set to true in production
    //   maxAge: 3600000, // 1 hour
    //   sameSite: 'none', // Allows cross-site cookies for all domains
    // });
    // for api testing purpose
    user.access_token = user.access_token;

    // Send the user information without the token in the body
    return user;
  }
}
