import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./user";
import ChatRoom from "./chat-room";

@Table({ tableName: "ChatMembers" })
class ChatMembers extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  userId: number;

  @ForeignKey(() => ChatRoom)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  roomId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default ChatMembers;
