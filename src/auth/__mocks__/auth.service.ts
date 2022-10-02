import { userStub, loggedUserResStub } from '../../user/test/stubs/user.sub';

export const AuthService = jest.fn().mockReturnValue({
  validateUser: jest.fn().mockResolvedValue(userStub() || null),
  login: jest.fn().mockResolvedValue(loggedUserResStub()),
  logout: jest.fn().mockResolvedValue({ message: 'Logout was successful' }),
});
