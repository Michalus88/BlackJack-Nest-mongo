import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserSchema } from '../../schemas/user.schema';
import { UserService } from '../user.service';
import { Connection, connect, Model } from 'mongoose';
import * as bcrypt from '../../utils/hash-pwd';
import { RegisterRes } from 'types';
import { userStub } from './stubs/user.sub';
import { GameResults } from '../../game/constants';

describe('UserService', () => {
  let service: UserService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    jest.clearAllMocks();
  });

  describe('UserService', () => {
    test('userService should be defined', () => {
      expect(service).toBeDefined();
    });

    test('userModel should be defined', () => {
      expect(userModel).toBeDefined();
    });

    describe('created', () => {
      describe('when create is called', () => {
        let newUser: User;
        let res: RegisterRes;

        beforeEach(async () => {
          jest
            .spyOn(bcrypt, 'hashPwd')
            .mockImplementation((pwd: string) => 'hashedPwd');
          res = await service.create({
            email: userStub().email,
            pwd: userStub().pwd,
            name: userStub().name,
          });
          const users = (await userModel.find()) as User[];
          newUser = users[0];
        });

        test('should call once hashPwd with the given password', async () => {
          expect(bcrypt.hashPwd).toHaveBeenCalledWith(userStub().pwd);
          expect(bcrypt.hashPwd).toBeCalledTimes(1);
        });

        test('should encode password correctly', async () => {
          expect(bcrypt.hashPwd).toHaveBeenCalledWith('password');
        });

        test('should created user with encode password', async () => {
          expect(newUser.pwd).toEqual('hashedPwd');
        });

        test('should created user with email equal to userStub().email', async () => {
          expect(newUser.email).toEqual(userStub().email);
        });

        test('should created user with name equal to userStub().name', async () => {
          expect(newUser.name).toEqual(userStub().name);
        });

        test('should created user with gameResult set on GameResults.NO_RESULT', async () => {
          expect(newUser.gameResult).toEqual(GameResults.NO_RESULT);
        });

        test('should created user with isBet & isDeal set on false', async () => {
          expect(newUser.isBet).toEqual(false);
          expect(newUser.isDeal).toEqual(false);
        });

        test('should created user with playerBet set on 0', async () => {
          expect(newUser.playerBet).toEqual(0);
        });

        test('should created user with dealerPoints & playerPoints set on 0', async () => {
          expect(newUser.dealerPoints).toEqual(0);
          expect(newUser.playerPoints).toEqual(0);
        });

        test('should created user with dealerCards,playerCards,deck arrays with length equal to 0', async () => {
          expect(newUser.dealerCards.length).toEqual(0);
          expect(newUser.playerCards.length).toEqual(0);
          expect(newUser.deck.length).toEqual(0);
        });

        test('should created user with __v set on 0', async () => {
          expect(newUser.__v).toEqual(0);
        });

        test('should be return RegisterRes', async () => {
          expect(res.message).toEqual('registration successful');
          expect(res.id).toBeDefined;
        });
      });
    });

    describe('getUser', () => {
      describe('when getUser is called', () => {
        let user: User;

        beforeEach(async () => {
          user = new userModel({
            email: userStub().email,
            pwd: userStub().pwd,
            name: userStub().name,
          });
          await user.save();
        });

        test('should be call with the User instance', async () => {
          jest.spyOn(service, 'getUser');
          await service.getUser(user);
          expect(service.getUser).toHaveBeenCalledWith(user);
        });

        test('should be return LoggedUserRes', async () => {
          jest.spyOn(service, 'getUser');
          const res = await service.getUser(user);
          expect(res).toEqual({ id: String(user._id), name: user.name });
        });
      });
    });

    describe('findByEmail', () => {
      describe('when findByEmail is called', () => {
        let user: User;

        beforeEach(async () => {
          user = new userModel({
            email: userStub().email,
            pwd: userStub().pwd,
            name: userStub().name,
          });
          await user.save();
        });

        test('should be call with provide email', async () => {
          jest.spyOn(service, 'findByEmail');
          await service.findByEmail(userStub().email);
          expect(service.findByEmail).toHaveBeenCalledWith(
            expect.stringContaining('@'),
          );
        });

        test('should be call once userModel.findOne with provide email ', async () => {
          jest.spyOn(userModel, 'findOne');
          await service.findByEmail(userStub().email);
          expect(userModel.findOne).toBeCalledTimes(1);
          expect(userModel.findOne).toHaveBeenCalledWith({
            email: userStub().email,
          });
        });

        test('should be return null if email not registerd ', async () => {
          const emailNotRegistered = 'noExist@gmail.com';
          jest.spyOn(service, 'findByEmail');
          const userSearched = await service.findByEmail(emailNotRegistered);
          expect(userSearched).toEqual(null);
        });

        test('should be return searched user if email registerd', async () => {
          jest.spyOn(service, 'findByEmail');
          const userSearched = await service.findByEmail(userStub().email);
          expect(userSearched._id).toEqual(user._id);
        });
      });
    });
  });
});
