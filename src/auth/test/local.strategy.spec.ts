import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

import { userStub } from '../../user/test/stubs/user.sub';
import { LocalStrategy } from '../local.strategy';
import { AuthService } from '../auth.service';
import { ResponseUserData } from '../../interfaces/user';

jest.mock('../auth.service.ts');

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [LocalStrategy, AuthService],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('LocalStrategy should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  it('AuthService should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validate', () => {
    describe('when validate is called', () => {
      const user = userStub();
      let res: ResponseUserData | UnauthorizedException;

      beforeEach(async () => {
        jest.spyOn(localStrategy, 'validate');
        jest.spyOn(authService, 'validateUser');
        res = await localStrategy.validate(user.email, user.pwd);
      });

      test('should be call with given email & pwd ', async () => {
        expect(localStrategy.validate).toHaveBeenCalledWith(
          user.email,
          user.pwd,
        );
      });

      test('then should be call once authService.validateUser() with passed email & pwd ', async () => {
        expect(authService.validateUser).toHaveBeenCalledWith(
          user.email,
          user.pwd,
        );
        expect(authService.validateUser).toBeCalledTimes(1);
      });

      test('if email and pwd correct should return ResponseUserData', async () => {
        expect(res).toEqual(userStub());
      });

      test('if bad email should return UnauthorizedException', async () => {
        const badEmail = 'wrongEmail@gmail.com';
        let res: UnauthorizedException;
        try {
          await localStrategy.validate(badEmail, userStub().pwd);
        } catch (error) {
          res = error;
        }
        expect(res).toEqual(new UnauthorizedException());
      });

      test('if bad pwd should return UnauthorizedException', async () => {
        const badPwd = 'badPwd';
        let res: UnauthorizedException;
        try {
          await localStrategy.validate(userStub().email, badPwd);
        } catch (error) {
          res = error;
        }
        expect(res).toEqual(new UnauthorizedException());
      });
    });
  });
});
