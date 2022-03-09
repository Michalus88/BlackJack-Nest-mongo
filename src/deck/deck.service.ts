import { Injectable } from '@nestjs/common';
import { CardInterface } from 'src/schemas/user.schema';
import { cardsTypes, cardsWeights } from './constans';

@Injectable()
export class DeckService {
  createDeck() {
    const deck: CardInterface[] = [];

    cardsTypes.forEach((type) =>
      cardsWeights.forEach((weight) => deck.push({ weight, type })),
    );
    return deck;
  }
}
