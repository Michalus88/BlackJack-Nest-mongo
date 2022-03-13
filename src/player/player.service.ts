import { Injectable } from '@nestjs/common';
import { UserData } from 'src/interfaces/user';
import { CardInterface } from 'src/schemas/user.schema';

@Injectable()
export class PlayerService {
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
