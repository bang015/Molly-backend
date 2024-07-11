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
  @Column(DataType.INTEGER)
  @AllowNull(false)
  userId: number;

  @BelongsTo(() => User, "userId")
  user: User;

  @ForeignKey(() => ChatRoom)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  roomId: number;

  @BelongsTo(() => ChatRoom, "roomId")
  room: User;

  @Column(DataType.TEXT)
  @AllowNull(false)
  message: string;

  @Column(DataType.BOOLEAN)
  @Default(false)
  isRead: boolean;
}

export default ChatMessage;
