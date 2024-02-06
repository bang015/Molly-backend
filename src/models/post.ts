import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import PostMedia from "./post-media"; 
import Comment from "./comment";

class Post extends Model {
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
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
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

Post.hasMany(PostMedia, { foreignKey: "postId" });
Post.hasMany(Comment, { foreignKey: "postId" });
export default Post;
