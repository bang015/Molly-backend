import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Comment extends Model {
  public id!: number;
  public postId!: number;
  public userId!: number;
  public content!: string;
  public commentId!: number | null;
}

Comment.init(
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
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'Comment',
        key: 'id'
      }
    },
  },
  {
    tableName: "comment",
    sequelize,
  }
);

export default Comment;
