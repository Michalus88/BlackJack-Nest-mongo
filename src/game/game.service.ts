import { Injectable } from '@nestjs/common';
import { DeckService } from 'src/deck/deck.service';
import { UserData } from 'src/interfaces/user';
import { PlayerService } from 'src/player/player.service';
import { UserService } from 'src/user/user.service';
import { sanitizeUser } from 'src/utils/sanitize-user';
import { PlayerBetDto } from './dto/player-bet.dto';

@Injectable()
export class GameService {
  constructor(
    private userService: UserService,
    private deckService: DeckService,
    private playerService: PlayerService,
  ) {}

  async initialize(user: UserData) {
    const player = await this.userService.findByEmail(user.email);
    this.deckService.dealCards(player);
    this.playerService.setPoints(player);

    await player.save();
    return sanitizeUser(player);
  }

  async setBet(user: UserData, playerBetDto: PlayerBetDto) {
    const player = await this.userService.findByEmail(user.email);
    this.playerService.betValidate(player, playerBetDto);

    player.means -= playerBetDto.bet;
    player.playerBet = playerBetDto.bet;
    player.isBet = true;

    await player.save();
    return player;
  }
}
