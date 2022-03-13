import { Injectable } from '@nestjs/common';
import { DeckService } from 'src/deck/deck.service';
import { UserData } from 'src/interfaces/user';
import { PlayerService } from 'src/player/player.service';
import { CardInterface } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { sanitizeUser } from 'src/utils/sanitize-user';

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
    this.playerService.calculatePoints(player);

    await player.save();
    return sanitizeUser(player);
  }
}
