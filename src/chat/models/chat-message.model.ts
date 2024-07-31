import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import User from '../../user/models/user.model';
import ChatRoom from './chat-room.model';
import BaseModel from '../../common/models/base.model';

@Table({ tableName: 'ChatMessage' })
class ChatMessage extends BaseModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @ForeignKey(() => ChatRoom)
  @Column({ type: DataType.INTEGER, allowNull: false })
  roomId: number;

  @BelongsTo(() => ChatRoom, 'roomId')
  room: ChatRoom;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isRead: boolean;
}

export default ChatMessage;