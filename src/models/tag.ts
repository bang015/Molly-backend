import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export default class Tag extends Model {
  public id!: number;
  public name!: string;
}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "tag",
    sequelize,
  }
);

