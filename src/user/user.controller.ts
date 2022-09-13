import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserObj } from 'src/decorators/user-object.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserData } from 'src/interfaces/user';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUser(@UserObj() user: UserData) {
    return this.userService.getUser(user);
  }

  @Post()
  create(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.create(registerUserDto);
  }
}
