import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./user";

export default class Post extends Model {
  public id!: number;
  public userId!: number;
  public content!: string;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "post",
    sequelize,
  }
);

Post.belongsTo(User, {
  foreignKey: "user_id",
});
