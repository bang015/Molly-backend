import { Socket } from 'socket.io';

export interface CustomSocket extends Socket {
  currentRoom?: string;
  userId?: number;
}
