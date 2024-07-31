import { BelongsToMany, HasMany, Table } from 'sequelize-typescript';
import User from '../../user/models/user.model';
import ChatMembers from './chat-members.model';
import BaseModel from '../../common/models/base.model';
import ChatMessage from './chat-message.model';

@Table({ tableName: 'ChatRoom' })
class ChatRoom extends BaseModel {
  @HasMany(() => ChatMembers, 'roomId')
  users: ChatMembers[];

  @HasMany(() => ChatMessage, 'roomId')
  message: ChatMessage[];
}

export default ChatRoom;
