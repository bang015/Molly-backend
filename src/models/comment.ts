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
import User from "./user";

@Table({ tableName: "Comment" })
class Comment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Post)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  postId: number;

  @BelongsTo(() => Post, "postId")
  post: Post;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  userId: number;

  @BelongsTo(() => User, "userId")
  user: User;

  @Column(DataType.TEXT)
  @AllowNull(false)
  content: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @ForeignKey(() => Comment)
  @Column(DataType.INTEGER)
  @AllowNull(true)
  commentId?: number;

  @BelongsTo(() => Comment, { foreignKey: "commentId", as: "parentComment" })
  parentComment: Comment;
}

export default Comment;
