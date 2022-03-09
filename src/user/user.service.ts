import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseUserData } from 'src/interfaces/user';

import { User } from 'src/schemas/user.schema';
import { hashPwd } from 'src/utils/hash-pwd';
import { sanitizeUser } from 'src/utils/sanitize-user';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(registerUserDto): Promise<ResponseUserData> {
    const { email, pwd } = registerUserDto as RegisterUserDto;
    const hashedPwd = hashPwd(pwd);
    const newUser = new this.userModel({ email, pwd: hashedPwd }) as User;
    await newUser.save();
    return sanitizeUser(newUser);
  }

  async findByEmail(email) {
    return await this.userModel.findOne({ email });
  }
}
