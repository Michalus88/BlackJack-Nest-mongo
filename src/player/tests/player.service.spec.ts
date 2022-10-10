import { Test, TestingModule } from '@nestjs/testing';

import { GameResults } from '../../game/constants';
import { User } from '../../schemas/user.schema';
import { userStub } from '../../user/test/stubs/user.sub';
import { noShuffleDeck } from '../../deck/test/helpers/deck';
import { PlayerService } from '../player.service';

describe('PlayerService', () => {
  let service: PlayerService;
  let player: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerService],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    player = userStub();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculatePoints', () => {
    describe('when calculatePoints is call', () => {
      const twoPoints = noShuffleDeck()[0];
      const king = noShuffleDeck()[11];
      const ace = noShuffleDeck()[12];

      beforeAll(() => {
        jest.spyOn(service, 'calculatePoints');
      });

      test('number cards should equal to their numerical value', () => {
        const result = service.calculatePoints([twoPoints]);
        expect(result).toEqual(2);
      });

      test('face card should equal 10', () => {
        const result = service.calculatePoints([king]);
        expect(result).toEqual(10);
      });

      test('ace should equal 11', () => {
        const result = service.calculatePoints([king, ace]);
        expect(result).toEqual(21);
      });

      test('ace should equal 1', () => {
        const result = service.calculatePoints([king, king, ace]);
        expect(result).toEqual(21);
      });
    });
  });

  describe('setPoints', () => {
    describe('when setPoints is call', () => {
      const king = noShuffleDeck()[11];
      beforeEach(() => {
        jest.spyOn(service, 'setPoints');
        player.playerCards = [king];
        player.dealerCards = [king];
        service.setPoints(player);
      });

      test('then should calculatePoints call once with passed cards', () => {
        jest.spyOn(service, 'calculatePoints');
        service.setPoints(player);
        expect(service.calculatePoints).toBeCalledTimes(2);
        expect(service.calculatePoints).toBeCalledWith([king]);
      });

      test('player points should equal passed cards value', () => {
        expect(player.playerPoints).toEqual(10);
      });

      test('dealer points should equal passed cards value', () => {
        service.setPoints(player);
        expect(player.dealerPoints).toEqual(10);
      });
    });
  });

  describe('setGameResult', () => {
    describe('when setGameResult is call', () => {
      beforeEach(() => {
        jest.spyOn(service, 'setGameResult');
      });

      test('if playerPoints < dealerPoints should result equal loose', () => {
        player.playerPoints = 2;
        service.setGameResult(player);
        expect(player.gameResult).toEqual(GameResults.LOOSE);
      });

      test('if playerPoints > 21 should result equal loose', () => {
        player.playerPoints = 22;
        service.setGameResult(player);
        expect(player.gameResult).toEqual(GameResults.LOOSE);
      });

      test('if playerPoints = dealerPoints should result equal draw', () => {
        service.setGameResult(player);
        expect(player.gameResult).toEqual(GameResults.DRAW);
      });

      test('if playerPoints > dealerPoints should result equal win', () => {
        player.playerPoints = 21;
        service.setGameResult(player);
        expect(player.gameResult).toEqual(GameResults.WIN);
      });

      test('if dealerPoints > 21 should result equal win', () => {
        player.dealerPoints = 22;
        service.setGameResult(player);
        expect(player.gameResult).toEqual(GameResults.WIN);
      });
    });
  });

  describe('setMeans', () => {
    describe('when setMeans is call', () => {
      beforeEach(() => {
        jest.spyOn(service, 'setMeans');
      });

      test('if gameResult equal loose, means should not be changed', () => {
        player.gameResult = GameResults.LOOSE;
        service.setMeans(player);

        expect(player.means).toEqual(200);
      });

      test('if gameResult equal draw, the means should be increased by the bet ', () => {
        service.setMeans(player);
        expect(player.means).toEqual(300);
      });

      test('if gameResult equal win, the means should be increased by the double bet ', () => {
        service.setMeans(player);
        expect(player.means).toEqual(300);
      });
    });
  });

  describe('resetAfterRoud', () => {
    describe('when resetAfterRoud is call', () => {
      beforeEach(() => {
        jest.spyOn(service, 'resetAfterRoud');
        service.resetAfterRoud(player);
      });

      test('gameResult should equal NO_RESULT', () => {
        expect(player.gameResult).toEqual(GameResults.NO_RESULT);
      });

      test('isDeal & isBet should equal false', () => {
        expect(player.isDeal).toEqual(false);
        expect(player.isBet).toEqual(false);
      });

      test('playerBet & playerPoints should equal 0', () => {
        expect(player.playerBet).toEqual(0);
        expect(player.playerPoints).toEqual(0);
      });
      test('dealerPoints should equal 0', () => {
        expect(player.gameResult).toEqual(0);
      });

      test('player & dealer cards array length should equal 0', () => {
        expect(player.playerCards).toHaveLength(0);
        expect(player.dealerCards).toHaveLength(0);
      });
    });
  });
});
