export interface SignupInput {
  email: string;
  nickname: string;
  password: string;
  name: string;
}

export interface GetUserInput {
  id?: number;
  email?: string;
  nickname?: string;
  name?: string;
}

export interface UserModify {
  id: number;
  email: string;
  nickname: string;
  name: string;
  password?: string;
  introduce?: string;
  profileImageId?: number;
}

