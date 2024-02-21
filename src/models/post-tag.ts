import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Post from "./post";
import Tag from "./tag";

export default class PostTag extends Model {
  public id!: number;
  public post_id!: number;
  public tag_id!: number;
}

PostTag.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: "post_tag",
    sequelize,
  }
);
Post.belongsToMany(Tag, { through: PostTag });
Tag.belongsToMany(Post, { through: PostTag });
