import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserObj } from 'src/decorators/user-object.decorator';
import { UserData } from 'src/interfaces/user';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async initialize(@UserObj() user: UserData) {
    return this.gameService.initialize(user);
  }
}
