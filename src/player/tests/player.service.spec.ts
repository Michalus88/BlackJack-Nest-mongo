import { Test, TestingModule } from '@nestjs/testing';

import { GameResults } from '../../game/constants';
import { User } from '../../schemas/user.schema';
import { userStub } from '../../user/test/stubs/user.sub';
import { noShuffleDeck } from '../../deck/test/helpers/deck';
import { PlayerService } from '../player.service';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerService],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
