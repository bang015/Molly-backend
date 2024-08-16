import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import User from '../../user/models/user.model';
import ChatRoom from './chat-room.model';
import BaseModel from '../../common/models/base.model';
import MessageReadStatus from './message-read.model';

export enum MessageType {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

@Table({ tableName: 'ChatMessage' })
class ChatMessage extends BaseModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @ForeignKey(() => ChatRoom)
  @Column({ type: DataType.INTEGER, allowNull: false })
  roomId: number;

  @BelongsTo(() => ChatRoom, { foreignKey: 'roomId', onDelete: 'CASCADE' })
  room: ChatRoom;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  @HasMany(() => MessageReadStatus)
  readStatuses: MessageReadStatus[];

  @Column({
    type: DataType.ENUM(...Object.values(MessageType)),
    allowNull: false,
    defaultValue: MessageType.USER,
  })
  type: MessageType;
}

export default ChatMessage;
