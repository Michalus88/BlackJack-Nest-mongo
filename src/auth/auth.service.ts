import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';

import { hashPwd } from '../utils/hash-pwd';
import { sanitizeUser } from '../utils/sanitize-user';
import { ResponseUserData, UserData } from '../interfaces/user';
import { UserService } from '../user/user.service';
import { stringToBoolean } from '../utils/string-to-boolean';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async validateUser(
    email: string,
    pwd: string,
  ): Promise<ResponseUserData | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.pwd === hashPwd(pwd)) {
      return sanitizeUser(user);
    }
    return null;
  }

  login(user: UserData, res: Response) {
    const userRes = { id: user._id, name: user.name };
    const payload = { email: user.email };
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    const oneDay = 1000 * 60 * 60 * 24;
    return res
      .cookie('jwt', token, {
        secure: stringToBoolean(process.env.COOKIE_SECURE),
        domain: process.env.DOMAIN,
        httpOnly: true,
        maxAge: oneDay,
      })
      .json(userRes);
  }

  logout(res: Response) {
    res
      .clearCookie('jwt', {
        secure: stringToBoolean(process.env.COOKIE_SECURE),
        domain: process.env.DOMAIN,
        httpOnly: true,
      })
      .json({ message: 'Logout was successful' });
  }
}
