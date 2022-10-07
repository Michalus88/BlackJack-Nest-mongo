import { Test, TestingModule } from '@nestjs/testing';

import { CardInterface, User } from '../../schemas/user.schema';
import { DeckService } from '../deck.service';
import { noShuffleDeck } from './helpers/deck';

describe('DeckService', () => {
  let service: DeckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeckService],
    }).compile();

    service = module.get<DeckService>(DeckService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDeck', () => {
    describe('when createDeck is called', () => {
      let deck: CardInterface[];

      beforeEach(() => {
        jest.spyOn(service, 'createDeck');
        jest.spyOn(service, 'shuffle');
        deck = service.createDeck();
      });

      test('then should be call once shuffle with deck', () => {
        expect(service.shuffle).toBeCalledTimes(1);
      });

      test('then should be return shuffle deck with 52 cards', () => {
        expect(deck).toHaveLength(52);
        expect(deck).not.toEqual(noShuffleDeck());
      });
    });
  });

  describe('dealCards', () => {
    describe('when dealCards is called', () => {
      const player = {
        deck: noShuffleDeck(),
        playerCards: [],
        dealerCards: [],
        isDeal: false,
      } as unknown as User;
      const deckLengthAfterDeal = 49;

      beforeAll(() => {
        jest.spyOn(service, 'dealCards');
        service.dealCards(player);
      });

      test('then should deck length equal 49', () => {
        expect(player.deck).toHaveLength(deckLengthAfterDeal);
      });

      test('then should playerCards length equal 2', () => {
        expect(player.playerCards).toHaveLength(2);
      });

      test('then should dealerCards length equal 1', () => {
        expect(player.dealerCards).toHaveLength(1);
      });

      test('then should isDeal equal true', () => {
        expect(player.isDeal).toEqual(true);
      });

      test('if isDeal equal true should not deal cards', () => {
        service.dealCards(player);
        expect(player.deck).toHaveLength(deckLengthAfterDeal);
      });

      test('if deck length equal 0 should call once createDeck', () => {
        jest.spyOn(service, 'createDeck');
        player.deck = [];
        service.dealCards(player);
        expect(service.createDeck).toBeCalledTimes(1);
      });

      test('then should deck length equal 52', () => {
        expect(player.deck).toHaveLength(52);
      });
    });
  });

  describe('pickCard', () => {
    describe('when pickCard is called', () => {
      const deck = noShuffleDeck();

      beforeEach(() => {
        jest.spyOn(service, 'pickCard');
        jest.spyOn(service, 'createDeck');
        service.pickCard(deck);
      });

      test('should deck length reduce by 1', () => {
        expect(deck).toHaveLength(51);
      });

      test('if deck length < 10 should call once createDeck', () => {
        const deck = noShuffleDeck().slice(43);
        service.pickCard(deck);
        expect(service.createDeck).toBeCalledTimes(1);
      });

      test('if createDeck is call should adde new cards to deck', () => {
        const deck = noShuffleDeck().slice(43);
        service.pickCard(deck);
        expect(deck).toHaveLength(60);
      });
    });
  });
});
