import { Injectable } from '@nestjs/common';

import { UserData } from '../interfaces/user';
import {
  GameResults,
  MAX_NUMBER_OF_POINTS,
  CardSymbols,
} from '../game/constants';
import { CardInterface } from '../schemas/user.schema';

@Injectable()
export class PlayerService {
  setPoints(player: UserData): void {
    player.playerPoints = this.calculatePoints(player.playerCards);
    player.dealerPoints = this.calculatePoints(player.dealerCards);
  }

  calculatePoints(cards: CardInterface[]): number {
    let points = 0;
    let aceCouter = 0;

    cards.forEach((card) => {
      const weight =
        card.weight === CardSymbols.KING ||
        card.weight === CardSymbols.QUEEN ||
        card.weight === CardSymbols.JACK ||
        card.weight === CardSymbols.ACE
          ? card.weight === CardSymbols.ACE
            ? 11
            : 10
          : card.weight;
      points += Number(weight);

      if (card.weight === CardSymbols.ACE) {
        aceCouter += 1;
      }
      if (points > MAX_NUMBER_OF_POINTS && aceCouter > 0) {
        aceCouter -= 1;
        points -= 10;
      }
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
