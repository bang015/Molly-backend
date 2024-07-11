import {
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./user";
import ChatMembers from "./chat-users";

@Table({ tableName: "ChatRoom" })
class ChatRoom extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @BelongsToMany(() => User, () => ChatMembers)
  users: User[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default ChatRoom;
