import mongoose from 'mongoose';

import { LoggedUserRes, RegisterRes } from 'types';
import { GameResults } from '../../../game/constants';
import { UserData } from '../../../interfaces/user';
import { noShuffleDeck } from '../../../deck/test/helpers/deck';

const id = new mongoose.Types.ObjectId('62c0674a077b23209608d4f9');
const deck = noShuffleDeck();

export const userStub = (): UserData =>
  ({
    _id: id,
    isBet: false,
    isDeal: false,
    dealerPoints: 5,
    playerBet: 100,
    playerPoints: 5,
    means: 200,
    pwd: 'password',
    email: 'test@wp.pl',
    name: 'Test',
    playerCards: [deck[0], deck[1]],
    dealerCards: [deck[0], deck[1]],
    deck: noShuffleDeck(),
    gameResult: GameResults.DRAW,
  } as unknown as UserData);

export const loggedUserResStub = (): LoggedUserRes => ({
  id: String(userStub()._id),
  name: userStub().name,
});

export const registerResStub = (): RegisterRes => ({
  id: String(userStub()._id),
  message: 'registration successful',
});
