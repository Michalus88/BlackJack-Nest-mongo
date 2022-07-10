import { Injectable } from '@nestjs/common';
import { UserData } from 'src/interfaces/user';
import { GameResults, MAX_NUMBER_OF_POINTS } from 'src/game/constants';
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
        card.weight === 'Q' ||
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

  setGameResult(player: UserData) {
    const { playerPoints, dealerPoints } = player;
    if (
      playerPoints > MAX_NUMBER_OF_POINTS ||
      (playerPoints < dealerPoints && dealerPoints <= MAX_NUMBER_OF_POINTS)
    ) {
      player.gameResult = GameResults.LOOSE;
    } else if (
      dealerPoints > MAX_NUMBER_OF_POINTS ||
      (playerPoints > dealerPoints && playerPoints <= MAX_NUMBER_OF_POINTS)
    ) {
      player.gameResult = GameResults.WIN;
    } else player.gameResult = GameResults.DRAW;
  }

  setMeans(player: UserData) {
    const { gameResult } = player;
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
