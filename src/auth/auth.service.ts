import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';

import { hashPwd } from 'src/utils/hash-pwd';
import { sanitizeUser } from 'src/utils/sanitize-user';
import { UserData } from 'src/interfaces/user';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async validateUser(email: string, pwd: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.pwd === hashPwd(pwd)) {
      return sanitizeUser(user);
    }
    return null;
  }

  login(user: UserData, res: Response) {
    const payload = { email: user.email };
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    const oneDay = 1000 * 60 * 60 * 24;
    return res
      .cookie('jwt', token, {
        secure: false,
        domain: 'localhost',
        httpOnly: true,
        maxAge: oneDay,
      })
      .json(user);
  }

  logout(res: Response) {
    res
      .clearCookie('jwt', {
        secure: false,
        domain: 'localhost',
        httpOnly: true,
      })
      .json({ message: 'Logout was successful' });
  }
}
