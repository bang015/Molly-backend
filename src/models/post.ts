import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
// import User from "./user";
const User = require("./User");
import PostMedia from "./post-media"; // Post 모델에 PostMedia 모델 추가
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

// Post.belongsTo(User, {
//   foreignKey: "userId",
// });

Post.hasMany(PostMedia, { foreignKey: "postId" });
Post.hasMany(Comment, { foreignKey: "postId" });
export default Post;
