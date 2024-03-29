import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class PostMedia extends Model {
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
    postId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
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

export default PostMedia;