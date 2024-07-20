import {
  BelongsToMany,
  Table,
} from 'sequelize-typescript';
import User from './user';
import ChatMembers from './chat-users';
import { BaseModel } from '../common/models/base.model';

@Table({ tableName: 'ChatRoom' })
class ChatRoom extends BaseModel {
  @BelongsToMany(() => User, () => ChatMembers)
  users: User[];
}

export default ChatRoom;
