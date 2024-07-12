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
  @Column({ type: DataType.INTEGER, allowNull: false })
  postId: number;

  @BelongsTo(() => Post, "postId")
  post: Post;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User, "userId")
  user: User;

  @Column({ type: DataType.TEXT, allowNull: false })
  content: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @ForeignKey(() => Comment)
  @Column({ type: DataType.INTEGER, allowNull: true })
  commentId?: number;

  @BelongsTo(() => Comment, { foreignKey: "commentId", as: "parentComment" })
  parentComment: Comment;
}

export default Comment;
