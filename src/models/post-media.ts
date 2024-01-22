import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Post from "./post";

export default class PostMedia extends Model {
  public id!: number;
  public postId!: number;
  public name!: string;
  public type!: string;
  public path!: string;
}

PostMedia.init(
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "post_media",
    sequelize,
  }
);

PostMedia.belongsTo(Post);
