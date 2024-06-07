interface IUser {
  name: string;
  email: string;
  password: string;
}

export type User = IUser;
export type CurrentUser = Omit<IUser, "password">;
