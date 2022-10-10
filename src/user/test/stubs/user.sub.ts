import mongoose from 'mongoose';

import { LoggedUserRes, RegisterRes } from 'types';
import { GameResults } from '../../../game/constants';
import { UserData } from '../../../interfaces/user';
import { noShuffleDeck } from '../../../deck/test/helpers/deck';

const id = new mongoose.Types.ObjectId('62c0674a077b23209608d4f9');

export const userStub = (): UserData =>
  ({
    _id: id,
    isBet: false,
    isDeal: false,
    dealerPoints: 9,
    playerBet: 100,
    playerPoints: 15,
    means: 200,
    pwd: 'password',
    email: 'test@wp.pl',
    name: 'Test',
    playerCards: [{ type: 'clubs', weight: '7' }],
    dealerCards: [{ type: 'clubs', weight: '8' }],
    deck: [{ type: 'clubs', weight: '9' }],
    gameResult: 0,
  } as unknown as UserData);

export const loggedUserResStub = (): LoggedUserRes => ({
  id: String(userStub()._id),
  name: userStub().name,
});

export const registerResStub = (): RegisterRes => ({
  id: String(userStub()._id),
  message: 'registration successful',
});
