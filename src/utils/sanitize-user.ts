import { ResponseUserData } from 'src/interfaces/user';
import { User } from 'src/schemas/user.schema';

export const sanitizeUser = (user: User): ResponseUserData => {
  const {
    _id,
    email,
    playerBet,
    playerCards,
    playerPoints,
    dealerCards,
    dealerPoints,
  } = user;
  return {
    _id,
    email,
    playerBet,
    playerCards,
    playerPoints,
    dealerCards,
    dealerPoints,
  };
};
