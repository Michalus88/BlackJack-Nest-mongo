import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'pwd',
    });
  }

  async validate(
    email: string,
    pwd: string,
  ): Promise<ResponseUserData | UnauthorizedException> {
    const user = await this.authService.validateUser(email, pwd);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
