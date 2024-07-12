import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import User from "./user";
import ChatRoom from "./chat-room";

@Table({ tableName: "ChatMessage" })
class ChatMessage extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User, "userId")
  user: User;

  @ForeignKey(() => ChatRoom)
  @Column({ type: DataType.INTEGER, allowNull: false })
  roomId: number;

  @BelongsTo(() => ChatRoom, "roomId")
  room: User;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isRead: boolean;
}

export default ChatMessage;
