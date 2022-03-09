import { ObjectId } from 'mongoose';
import { CardInterface, User } from 'src/schemas/user.schema';

export interface ResponseUserData {
  _id: ObjectId;
  email: string;
  playerBet: number;
  playerCards: CardInterface[];
  playerPoints: number;
  dealerCards: CardInterface[];
  dealerPoints: number;
}

export interface UserData extends User {
  _id: ObjectId;
}
