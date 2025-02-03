interface ILoginRequest {
  username: string;
  password: string;
}

interface ILoginResponse {
  access_token: string;
  user: ICurrentUser;
}

interface ICurrentUser {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
}
