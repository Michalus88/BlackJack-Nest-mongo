import { CardTypeRes } from 'types/game/game';

export interface PlayerDataRes {
  _id: string;
  name: string;
  email: string;
  gameResult: number;
  means: number;
  playerBet: number;
  playerCards: CardTypeRes[];
  playerPoints: number;
  dealerCards: CardTypeRes[];
  dealerPoints: number;
  isBet: boolean;
}
