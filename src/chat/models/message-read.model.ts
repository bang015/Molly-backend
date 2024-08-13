import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import User from '../../user/models/user.model';
import BaseModel from '../../common/models/base.model';
import ChatMessage from './chat-message.model';

@Table({ tableName: 'MessageReadStatus' })
class MessageReadStatus extends BaseModel {
  @ForeignKey(() => ChatMessage)
  @Column({ type: DataType.INTEGER, allowNull: false })
  messageId: number;

  @BelongsTo(() => ChatMessage, 'messageId')
  message: ChatMessage;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isRead: boolean;
}

export default MessageReadStatus;
