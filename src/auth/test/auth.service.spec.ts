import { Test, TestingModule } from '@nestjs/testing';
import { ResponseUserData } from '../../interfaces/user';
import { userStub } from '../../user/test/stubs/user.sub';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import * as crypto from '../../utils/hash-pwd';
import { response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigModule } from '@nestjs/config';

jest.mock('../../user/user.service.ts');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [AuthService, UserService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('AuthService should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('UserService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('validateUser', () => {
    describe('when validateUser is called', () => {
      let res: ResponseUserData | null;

      beforeEach(async () => {
        jest.spyOn(userService, 'findByEmail');
        jest.spyOn(authService, 'validateUser');
        jest.spyOn(crypto, 'hashPwd').mockImplementation((pwd: string) => pwd);
      });

      test('should be call with the email and pwd', async () => {
        await authService.validateUser(userStub().email, userStub().pwd);
        expect(authService.validateUser).toHaveBeenCalledWith(
          userStub().email,
          userStub().pwd,
        );
      });

      test('if email is not register should be return null', async () => {
        const notRegisterEmail = 'notRegister@gmail.com';
        res = await authService.validateUser(notRegisterEmail, userStub().pwd);
        expect(res).toEqual(null);
      });

      test('if pwd is not correct should be return null', async () => {
        const badPwd = 'badPassword';
        res = await authService.validateUser(userStub().email, badPwd);
        expect(res).toEqual(null);
      });

      test('if email and pwd is correct should be return user', async () => {
        res = await authService.validateUser(userStub().email, userStub().pwd);
        expect(res._id).toBeDefined();
        expect(res.name).toEqual(userStub().name);
      });
    });
  });

  describe('login', () => {
    describe('when login is called', () => {
      const payload = { email: userStub().email };
      const expiresIn = { expiresIn: '1d' };
      let jwtSecret: string;

      beforeEach(async () => {
        jest.spyOn(authService, 'login');
        jest.spyOn(jwt, 'sign');
        jest.spyOn(response, 'cookie').mockReturnValue(response);
        jest.spyOn(response, 'json').mockReturnValue(response);
        jwtSecret = process.env.JWT_SECRET;
        authService.login(userStub(), response);
      });

      test('then should be sign() call once with payload', () => {
        expect(jwt.sign).toBeCalledTimes(1);
        expect(jwt.sign).toBeCalledWith(payload, jwtSecret, expiresIn);
      });

      test('then should be sign() return token', () => {
        const token = jwt.sign(payload, jwtSecret, expiresIn);
        expect(token).toHaveLength(156);
      });

      test('then should be json() call with LoggedUserRes', () => {
        const loggedUserRes = { id: userStub()._id, name: userStub().name };
        expect(response.json).toHaveBeenCalledWith(loggedUserRes);
      });
    });
  });

  describe('logout', () => {
    describe('when logout is called', () => {
      beforeEach(async () => {
        jest.spyOn(authService, 'logout');
        jest.spyOn(response, 'clearCookie').mockReturnValue(response);
        jest.spyOn(response, 'json').mockReturnValue(response);
        authService.logout(response);
      });

      test('then should be clearCookie() call once', () => {
        expect(response.clearCookie).toBeCalledTimes(1);
      });

      test('then should be json() call with logout message', () => {
        const logOutMessage = { message: 'Logout was successful' };
        expect(response.json).toHaveBeenCalledWith(logOutMessage);
      });
    });
  });
});
