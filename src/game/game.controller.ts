import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserObj } from 'src/decorators/user-object.decorator';
import { UserData } from 'src/interfaces/user';
import { PlayerBetDto } from './dto/player-bet.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async initialize(@UserObj() user: UserData) {
    return this.gameService.initialize(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('pick-card')
  async playerChooseTheCard(@UserObj() user: UserData) {
    return this.gameService.playerChooseTheCard(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('bet')
  async setBet(@UserObj() user: UserData, @Body() playerBetDto: PlayerBetDto) {
    return this.gameService.setBet(user, playerBetDto);
  }
}
