import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { hashPwd } from 'src/utils/hash-pwd';
import { sanitizeUser } from 'src/utils/sanitize-user';

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
}
