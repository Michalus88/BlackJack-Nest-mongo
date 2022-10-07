import { CARDS_WEIGHTS, CARD_TYPES } from '../../constants';
import { CardInterface } from '../../../schemas/user.schema';

export const noShuffleDeck = () => {
  const deck: CardInterface[] = [];
  CARD_TYPES.forEach((type) =>
    CARDS_WEIGHTS.forEach((weight) => deck.push({ weight, type })),
  );
  return deck;
};
