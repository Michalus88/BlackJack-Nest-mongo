import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';
import { CardInterface, User } from 'src/schemas/user.schema';

export interface ResponseUserData {
  _id: ObjectId;
  name: string;
  email: string;
  gameResult: number;
  means: number;
  playerBet: number;
  playerCards: CardInterface[];
  playerPoints: number;
  dealerCards: CardInterface[];
  dealerPoints: number;
  isBet: boolean;
}

export type UserData = User;
