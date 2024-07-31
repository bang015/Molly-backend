export interface ProfileImageDetail {
  name: string;
  type: string;
  path: string;
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
