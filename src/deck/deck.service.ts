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
    return this.shuffle(deck);
  }

  shuffle(deck: CardInterface[]) {
    const cards = deck;
    for (let i = deck.length - 1; i >= 0; i--) {
      const randomCardIndex = Math.floor(Math.random() * i);
      const currentIterationCard = deck[i];
      deck[i] = deck[randomCardIndex];
      deck[randomCardIndex] = currentIterationCard;
    }
    return cards;
  }
}
