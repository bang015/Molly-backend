import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class ChatUsers extends Model {
  public userId!: number;
  public roomId!: number;
}

ChatUsers.init(
  {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    roomId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "Chat_room",
        key: "id",
      },
    },
  },
  {
    tableName: "chat_users",
    sequelize,
  }
);

export default ChatUsers;
