import { loggedUserResStub, userStub } from '../../user/test/stubs/user.sub';

export const AuthService = jest.fn().mockReturnValue({
  validateUser: jest.fn().mockResolvedValue(userStub() || null),
  login: jest.fn().mockResolvedValue({ json: loggedUserResStub() }),
  logout: jest
    .fn()
    .mockResolvedValue({ json: { message: 'Logout was successful' } }),
});
