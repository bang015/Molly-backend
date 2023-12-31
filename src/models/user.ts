import { Model, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/database";
import Image from "./image";
export default class User extends Model {
  public id!: number;
  public email!: string;
  public nickname!: string;
  public name!: string;
  public password!: string;
  public introduce!: string | null;
  public profile_image!: number | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
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
    sequelize,
    timestamps: true,
    underscored: true,
  }
);

User.belongsTo(Image, { foreignKey: "profile_image" });

User.beforeCreate(async (user) => {
  const encryptedPw = await bcrypt.hash(user.password, 10);
  user.password = encryptedPw;
});
