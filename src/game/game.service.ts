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
    this.dealCards(player);
    this.calculatePoints(player);

    player.save();
    return sanitizeUser(player);
  }

  dealCards(player: UserData) {
    const { deck, playerCards, dealerCards, isDeal } = player;

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
  }

  pickCard(deck: CardInterface[]) {
    if (deck.length < 10) {
      deck.push(...this.deckService.createDeck());
    }
    const card = deck.pop();
    return card;
  }

  calculatePoints(player: UserData): void {
    player.playerPoints = this.addPoints(player.playerCards);
    player.dealerPoints = this.addPoints(player.dealerCards);
  }

  addPoints(cards): number {
    let points = 0;
    cards.forEach((card) => {
      const weight =
        card.weight === 'J' ||
        card.weight === 'D' ||
        card.weight === 'K' ||
        card.weight === 'A'
          ? card.weight === 'A' && cards.length > 2
            ? 1
            : 10
          : card.weight;
      points += Number(weight);
    });
    return points;
  }
}
