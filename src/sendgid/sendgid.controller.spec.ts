import { Test, TestingModule } from '@nestjs/testing';
import { SendgidController } from './sendgid.controller';

describe('SendgidController', () => {
  let controller: SendgidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendgidController],
    }).compile();

    controller = module.get<SendgidController>(SendgidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
