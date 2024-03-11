import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class ChatMessage extends Model {
  public id!: number;
  public userId!: number;
  public roomId!: number;
  public message!: string;
  public isRead!: boolean;
}

ChatMessage.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
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
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "chat_message",
    sequelize,
  }
);
export default ChatMessage;
