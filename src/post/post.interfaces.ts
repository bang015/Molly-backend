export interface MediaType {
  name: string;
  path: string;
  type: string;
}

export interface CreatePostInput {
  userId: number;
  content: string;
}