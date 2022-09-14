import { Test, TestingModule } from '@nestjs/testing';
import { LoggedUserRes, RegisterRes } from 'types';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { userStub, registerResStub, loggedUserResStub } from './stubs/user.sub';

jest.mock('../user.service.ts');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    describe('when getUser is called', () => {
      let loggedUser: LoggedUserRes;

      beforeEach(async () => {
        loggedUser = await userController.getUser(userStub());
      });

      test('then it should call usersService', () => {
        expect(userService.getUser).toHaveBeenCalledWith(userStub());
      });

      test('then is should return a user', () => {
        expect(loggedUser).toEqual(loggedUserResStub());
      });
    });
  });

  describe('createUser', () => {
    describe('when createUser is called', () => {
      let registerRes: RegisterRes;
      let registerUserDto: RegisterUserDto;

      beforeEach(async () => {
        registerUserDto = {
          name: userStub().name,
          pwd: userStub().pwd,
          email: userStub().email,
        };

        registerRes = await userController.create(registerUserDto);
      });

      test('then it should call usersService', () => {
        expect(userService.create).toHaveBeenCalledWith(registerUserDto);
      });

      test('then is should return a registerRes', () => {
        expect(registerRes).toEqual(registerResStub());
      });
    });
  });

  test('should be defined', () => {
    expect(userController).toBeDefined();
  });
});
