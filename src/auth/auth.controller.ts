import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { UserData } from 'src/interfaces/user';
import { LocalAuthGuard } from './local-auth.guard';
import { UserObj } from 'src/decorators/user-object.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@UserObj() user: UserData, @Res() res: Response) {
    return await this.authService.login(user, res);
  }
}
