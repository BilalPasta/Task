import { Inject, Injectable, Req } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express'; // Import Request type for typing purposes
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(ConfigService) private configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        // Extract JWT from either cookies or Authorization header
        if (req.cookies && req.cookies.accessToken) {
          return req.cookies.accessToken;
        }
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith('Bearer ')
        ) {
          return req.headers.authorization.split(' ')[1]; // Extract Bearer token
        }
        return null; // No token found
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      first_name: payload.first_name,
      last_name: payload.last_name,
      sub: payload.id,
      email: payload.email,
      is_admin: payload.is_admin,
    };
  }
}
