import Bookmark from "./bookmark.modal";
import Comment from "./comment";
import Like from "./like";
import PostMedia from "./post-media";
import PostTag from "./post-tag";
import Tag from "./tag";
import User from "./user";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

@Table({ tableName: "Post" })
class Post extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  userId: number;

  @Column(DataType.TEXT)
  @AllowNull(false)
  content: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Bookmark)
  bookmarks: Bookmark[];

  @HasMany(() => PostMedia)
  postMedias: PostMedia[];

  @HasMany(() => Comment)
  comments: Comment[];

  @BelongsToMany(() => Tag, () => PostTag)
  tags: Tag[];

  @BelongsToMany(() => User, () => Like)
  users: User[];
}

export default Post;
