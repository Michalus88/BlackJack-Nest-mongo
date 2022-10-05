import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { VerifiedCallback } from 'passport-jwt';

import { JwtStrategy } from '../jwt.strategy';
import { UserService } from '../../user/user.service';
import { userStub } from '../../user/test/stubs/user.sub';

jest.mock('../../user/user.service.ts');

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [JwtStrategy, UserService],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('JwtStrategy should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('UserService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('validate', () => {
    describe('when validate is called', () => {
      const user = userStub();
      const done: VerifiedCallback = jest.fn().mockImplementation((...args) => {
        if (args[0] === null) {
          return user;
        }
        return new UnauthorizedException();
      });

      beforeEach(async () => {
        jest.spyOn(jwtStrategy, 'validate');
        jest.spyOn(userService, 'findByEmail');
        await jwtStrategy.validate({ email: user.email }, done);
      });

      test('should be call with JwtPayload & VerifiedCallback ', async () => {
        expect(jwtStrategy.validate).toHaveBeenCalledWith(
          { email: user.email },
          done,
        );
      });

      test('then should be call once userService.findByEmail with email  ', async () => {
        expect(userService.findByEmail).toHaveBeenCalledWith(
          expect.stringContaining('@'),
        );
        expect(userService.findByEmail).toBeCalledTimes(1);
      });

      test('if user not null should return VerifiedCallback with null & user', async () => {
        expect(done).toHaveBeenCalledWith(null, user);
      });

      test('if user equal null should return VerifiedCallback with UnauthorizedException() & false', async () => {
        const badEmail = 'wrongEmail@gmail.com';
        await jwtStrategy.validate({ email: badEmail }, done);
        expect(done).toHaveBeenCalledWith(new UnauthorizedException(), false);
      });
    });
  });
});
