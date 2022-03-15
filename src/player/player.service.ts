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
  setPoints(player: UserData): void {
    player.playerPoints = this.calculatePoints(player.playerCards);
    player.dealerPoints = this.calculatePoints(player.dealerCards);
  }

  calculatePoints(cards: CardInterface[]): number {
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

  calculationOfMeans(player: UserData, gameResult: GameResults): number {
    switch (gameResult) {
      case GameResults.WIN:
        player.means += player.playerBet * 2;
        break;
      case GameResults.DRAW:
        player.means += player.playerBet;
        break;
      case GameResults.LOOSE:
        player.means;
        break;
    }
    return player.means;
  }

  betValidate(player: UserData, playerBetDto: PlayerBetDto) {
    if (!player.isDeal) {
      throw new ForbiddenException('You must have cards first ');
    }
    if (player.isBet) {
      throw new BadRequestException('Bet is already set');
    }
    if (playerBetDto.bet > player.means) {
      throw new BadRequestException(`You can't bet more than ${player.means}`);
    }
  }

  cardSelectionVerifier(player: UserData) {
    if (!player.isBet) {
      throw new ForbiddenException('You have to bet first');
    }
    if (player.gameResult !== GameResults.NO_RESULT) {
      throw new ForbiddenException('This game has ended');
    }
  }

  resetAfterRoud(player: UserData): void {
    player.gameResult = GameResults.NO_RESULT;
    player.isDeal = false;
    player.isBet = false;
    player.playerBet = 0;
    player.playerPoints = 0;
    player.playerCards = [];
    player.dealerPoints = 0;
    player.dealerCards = [];
  }
}
