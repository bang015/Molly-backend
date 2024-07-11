import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
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

@Table({ tableName: "PostMedia" })
class PostMedia extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  @AllowNull(false)
  name: string;

  @Column(DataType.STRING)
  @AllowNull(false)
  type: string;

  @Column(DataType.STRING)
  @AllowNull(false)
  path: string;

  @ForeignKey(() => Post)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  postId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Post)
  post: Post;
}

export default PostMedia;
