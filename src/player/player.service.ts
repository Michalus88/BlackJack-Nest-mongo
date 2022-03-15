import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GameResults } from 'src/game/constant';
import { PlayerBetDto } from 'src/game/dto/player-bet.dto';
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

  validateBet(player: UserData, playerBetDto: PlayerBetDto) {
    if (player.isBet) throw new BadRequestException('Bet is already set');
    if (playerBetDto.bet > player.means)
      throw new BadRequestException(`You cann not bet more than &{means}`);
  }
}
