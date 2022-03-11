import { Injectable } from '@nestjs/common';
import { DeckService } from 'src/deck/deck.service';
import { UserData } from 'src/interfaces/user';
import { CardInterface } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { sanitizeUser } from 'src/utils/sanitize-user';

@Injectable()
export class GameService {
  constructor(
    private userService: UserService,
    private deckService: DeckService,
  ) {}
  async initialize(user: UserData) {
    const player = await this.userService.findByEmail(user.email);
    const { deck, playerCards, dealerCards } = player;

    if (deck.length === 0) {
      deck.push(...this.deckService.createDeck());
    }
    if (!isDeal) {
      for (let i = 0; i < 2; i++) {
        playerCards.push(this.pickCard(deck));
      }
      dealerCards.push(this.pickCard(deck));
    }
    player.isDeal = true;
    player.save();
    console.log(player);

    return sanitizeUser(player);
  }

  pickCard(deck: CardInterface[]) {
    if (deck.length < 10) {
      deck = this.deckService.createDeck();
    }
    const card = deck.pop();
    return card;
  }
}
