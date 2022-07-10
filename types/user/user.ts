export interface RegisterReq {
  name: string;
  pwd: string;
  email: string;
}

export interface RegisterRes {
  id: string;
  message: string;
}

export interface LoggedUserRes {
  id: string;
  name: string;
}
