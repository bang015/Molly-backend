export interface IUserforSignUp {
  email: string;
  nickname: string;
  password: string;
  name: string;
}

export interface IUserInfo {
  id?: number;
  email?: string;
  nickname?: string;
  name?: string;
}

export interface IUserModify {
  id: number;
  email: string;
  nickname: string;
  name: string;
  password?: string;
  introduce?: string;
  profile_image?: number;
}

