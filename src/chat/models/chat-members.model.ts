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

@Table({ tableName: 'ChatMembers' })
class ChatMembers extends BaseModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @ForeignKey(() => ChatRoom)
  @Column({ type: DataType.INTEGER, allowNull: false })
  roomId: number;

  @BelongsTo(() => ChatRoom, { foreignKey: 'roomId', onDelete: 'CASCADE' })
  room: ChatRoom;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isActive: boolean;
}

export default ChatMembers;
