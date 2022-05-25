import { Test, TestingModule } from '@nestjs/testing';
import { SendgidService } from './sendgid.service';

describe('SendgidService', () => {
  let service: SendgidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendgidService],
    }).compile();

    service = module.get<SendgidService>(SendgidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
