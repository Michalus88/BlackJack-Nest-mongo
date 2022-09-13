import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { UserData } from 'src/interfaces/user';
import { LocalAuthGuard } from './local-auth.guard';
import { UserObj } from 'src/decorators/user-object.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@UserObj() user: UserData, @Res() res: Response) {
    return await this.authService.login(user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
