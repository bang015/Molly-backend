import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./user";

export default class Follow extends Model {
  public followerId!: number;
  public followingId!: number;
}

Follow.init(
  {},
  {
    tableName: "follow",
    sequelize,
  }
);
