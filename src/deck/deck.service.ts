import { Injectable } from '@nestjs/common';
import { UserData } from 'src/interfaces/user';
import { CardInterface } from 'src/schemas/user.schema';
import { cardsTypes, cardsWeights } from './constans';

@Injectable()
export class DeckService {
  dealCards(player: UserData) {
    const { deck, playerCards, dealerCards, isDeal } = player;

    if (deck.length === 0) {
      deck.push(...this.createDeck());
    }
    if (!isDeal) {
      for (let i = 0; i < 2; i++) {
        playerCards.push(this.pickCard(deck));
      }
      dealerCards.push(this.pickCard(deck));
    }
    player.isDeal = true;
  }

  createDeck(): CardInterface[] {
    const deck: CardInterface[] = [];
    cardsTypes.forEach((type) =>
      cardsWeights.forEach((weight) => deck.push({ weight, type })),
    );

    return this.shuffle(deck);
  }

  shuffle(deck: CardInterface[]): CardInterface[] {
    const cards = deck;
    for (let i = deck.length - 1; i >= 0; i--) {
      const randomCardIndex = Math.floor(Math.random() * i);
      const currentIterationCard = deck[i];
      deck[i] = deck[randomCardIndex];
      deck[randomCardIndex] = currentIterationCard;
    }

    return cards;
  }

  pickCard(deck: CardInterface[]): CardInterface {
    if (deck.length < 10) {
      deck.push(...this.createDeck());
    }
    const card = deck.pop();

    return card;
  }
}
