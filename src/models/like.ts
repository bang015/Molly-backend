import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Like extends Model {
  public id!: number;
  public postId!: number;
  public userId!: number;
}

Like.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "Post",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
  },
  {
    tableName: "like",
    sequelize,
  }
);

export default Like;