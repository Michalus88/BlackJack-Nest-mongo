import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Response } from 'express';
import { loggedUserResStub, userStub } from '../../user/test/stubs/user.sub';

jest.mock('../auth.service.ts');

const response = {
  json: jest.fn((result) => result),
} as unknown as Response;

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('AuthController should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('AuthService should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    describe('when login is called', () => {
      let res: Response;

      beforeEach(async () => {
        res = await authController.login(userStub(), response);
      });

      test('then it should call once authService.login', () => {
        expect(authService.login).toHaveBeenCalledWith(userStub(), response);
        expect(authService.login).toBeCalledTimes(1);
      });

      test('then is should return a LoggedUserRes', () => {
        expect(res.json).toEqual(loggedUserResStub());
      });
    });
  });

  describe('logout', () => {
    describe('when logout is called', () => {
      let res: Response;

      beforeEach(async () => {
        res = await authController.logout(response);
      });

      test('then it should call once authService.logout', () => {
        expect(authService.logout).toHaveBeenCalledWith(response);
        expect(authService.logout).toBeCalledTimes(1);
      });

      test('then is should return a success message', () => {
        expect(res.json).toEqual({ message: 'Logout was successful' });
      });
    });
  });
});
