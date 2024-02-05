import { Model, DataTypes, Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/database";
import ProfileImage from "./profile-image";
import Follow from "./follow";
import Comment from "./comment";

const mySequelizeInstance: Sequelize = sequelize;

export class User extends Model {
  public id!: number;
  public email!: string;
  public nickname!: string;
  public name!: string;
  public password!: string;
  public introduce!: string | null;
  public profileImage!: number | null;
  ProfileImage: any;
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
    sequelize: mySequelizeInstance,
    timestamps: true,
    underscored: true,
  }
);
User.belongsTo(ProfileImage, { foreignKey: "profile_image" });
// User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
User.beforeCreate(async (user) => {
  const encryptedPw = await bcrypt.hash(user.password, 10);
  user.password = encryptedPw;
});

export default User;
