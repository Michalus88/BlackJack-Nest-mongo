import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { UserData } from 'src/interfaces/user';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { UserObj } from '../decorators/user-object.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@UserObj() user: UserData, @Res() res: Response) {
    return await this.authService.login(user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
