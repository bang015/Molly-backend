import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import Post from "./post";
import Tag from "./tag";

@Table({ tableName: "PostTag" })
class PostTag extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Post)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  postId: number;

  @ForeignKey(() => Tag)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  tagId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default PostTag;
