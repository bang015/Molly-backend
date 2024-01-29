import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./user";
import PostMedia from "./post-media"; // Post 모델에 PostMedia 모델 추가

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
  foreignKey: "userId",
});

Post.hasMany(PostMedia, { foreignKey: "postId" });

export default Post;