import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserData } from 'src/interfaces/user';

import { User } from 'src/schemas/user.schema';
import { hashPwd } from 'src/utils/hash-pwd';
import { RegisterRes, LoggedUserRes } from 'types';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getUser(user: UserData): Promise<LoggedUserRes> {
    const { _id, name } = user;
    return { id: String(_id), name };
  }

  async create(registerUserDto: RegisterUserDto): Promise<RegisterRes> {
    const { email, pwd, name } = registerUserDto;
    const hashedPwd = hashPwd(pwd);
    const newUser = new this.userModel({
      email,
      pwd: hashedPwd,
      name,
    }) as UserData;
    await newUser.save();
    return { id: String(newUser._id), message: 'registration successful' };
  }

  async findByEmail(email): Promise<UserData | null> {
    return this.userModel.findOne({ email });
  }
}
