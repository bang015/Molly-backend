import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import ChatMembers from './chat-members.model';
import BaseModel from '../../common/models/base.model';
import ChatMessage from './chat-message.model';

@Table({ tableName: 'ChatRoom' })
class ChatRoom extends BaseModel {
  @HasMany(() => ChatMembers, { onDelete: 'CASCADE' })
  users: ChatMembers[];

  @HasMany(() => ChatMessage)
  message: ChatMessage[];

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isGroupChat: boolean;
}

export default ChatRoom;
