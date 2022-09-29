import {
  userStub,
  registerResStub,
  loggedUserResStub,
} from '../test/stubs/user.sub';

export const UserService = jest.fn().mockReturnValue({
  getUser: jest.fn().mockResolvedValue(loggedUserResStub()),
  create: jest.fn().mockResolvedValue(registerResStub()),
  findByEmail: jest.fn().mockResolvedValue(userStub()),
});
