import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseUserData } from 'src/interfaces/user';

import { User } from 'src/schemas/user.schema';
import { hashPwd } from 'src/utils/hash-pwd';
import { sanitizeUser } from 'src/utils/sanitize-user';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(email: string, pwd: string): Promise<ResponseUserData> {
    const hashedPwd = hashPwd(pwd);
    const newUser = new this.userModel({ email, pwd: hashedPwd }) as User;
    await newUser.save();
    return sanitizeUser(newUser);
  }
}
