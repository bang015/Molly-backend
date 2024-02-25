import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
class Bookmark extends Model {
  public id!: number;
  public postId!: number;
  public userId!: number;
}

Bookmark.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "Post",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    }
  },
  {
    tableName: "bookmark",
    sequelize,
  }
);
export default Bookmark;