import { loggedUserResStub, userStub } from '../../user/test/stubs/user.sub';

export const AuthService = jest.fn().mockReturnValue({
  validateUser: jest
    .fn()
    .mockImplementation(async (email: string, pwd: string) => {
      if (email === userStub().email && pwd === userStub().pwd) {
        return userStub();
      } else {
        return null;
      }
    }),
  login: jest.fn().mockResolvedValue({ json: loggedUserResStub() }),
  logout: jest
    .fn()
    .mockResolvedValue({ json: { message: 'Logout was successful' } }),
});
