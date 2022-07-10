import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { RegisterReq } from 'types';

export class RegisterUserDto implements RegisterReq {
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  pwd: string;
}
