import { ResponseUserData, UserData } from 'src/interfaces/user';

export const sanitizeUser = (user: UserData): ResponseUserData => {
  const {
    _id,
    name,
    email,
    gameResult,
    means,
    playerBet,
    playerCards,
    playerPoints,
    dealerCards,
    dealerPoints,
    isBet,
  } = user;
  return {
    _id,
    name,
    email,
    gameResult,
    means,
    playerBet,
    playerCards,
    playerPoints,
    dealerCards,
    dealerPoints,
    isBet,
  };
};
