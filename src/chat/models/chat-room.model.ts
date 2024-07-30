import { BelongsToMany, Table } from 'sequelize-typescript';
import User from '../../user/models/user.model';
import ChatMembers from './chat-members.model';
import BaseModel from '../../common/models/base.model';

@Table({ tableName: 'ChatRoom' })
class ChatRoom extends BaseModel {
  @BelongsToMany(() => User, () => ChatMembers)
  users: User[];
}

export default ChatRoom;
