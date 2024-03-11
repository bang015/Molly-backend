import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class ChatRoom extends Model {
  public id!: number;
}

ChatRoom.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: "chat_room",
    sequelize,
  }
);
export default ChatRoom;
