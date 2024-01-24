import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./user";

export default class Follow extends Model {
  public followerId!: number;
  public followingId!: number;
  User: any;
}

Follow.init(
  {},
  {
    tableName: "follow",
    sequelize,
  }
);

Follow.belongsTo(User, { foreignKey: "followerId" });
Follow.belongsTo(User, { foreignKey: "followingId" });
