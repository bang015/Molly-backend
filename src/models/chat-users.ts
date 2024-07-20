import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import User from './user';
import ChatRoom from './chat-room';
import { BaseModel } from '../common/models/base.model';

@Table({ tableName: 'ChatMembers' })
class ChatMembers extends BaseModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @ForeignKey(() => ChatRoom)
  @Column({ type: DataType.INTEGER, allowNull: false })
  roomId: number;
}

export default ChatMembers;
