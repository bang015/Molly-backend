import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export class User extends Model {
  public id!: number;
  public email!: string;
  public nickname!: string;
  public name!: string;
  public password!: string;
  public introduce!: string | null;
  public profile_image!: number | null;
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    introduce: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    profile_image: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: "user",
    modelName: "User",
    sequelize,
    timestamps: true,
    underscored: true,
  }
);


export default User;
