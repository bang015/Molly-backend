import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";
import ProfileImage from "./profile-image";
import Post from "./post";
import Bookmark from "./bookmark.modal";
import Like from "./like";
import Follow from "./follow";
import ChatRoom from "./chat-room";
import ChatMembers from "./chat-users";
import Comment from "./comment";

@Table({ tableName: "User" })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @IsEmail
  @Column(DataType.STRING)
  @Unique
  @AllowNull(false)
  email: string;

  @Column(DataType.STRING)
  @Unique
  @AllowNull(false)
  nickname: string;

  @Column(DataType.STRING)
  @AllowNull(false)
  name: string;

  @Column(DataType.STRING)
  @AllowNull(false)
  password: string;

  @Column(DataType.TEXT)
  @AllowNull(true)
  introduce?: string;

  @Column(DataType.INTEGER)
  @AllowNull(true)
  profileImageId?: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => ProfileImage, "profileImageId")
  profileImage!: ProfileImage;

  @HasMany(() => Post, { onDelete: "CASCADE" })
  posts: Post[];

  @HasMany(() => Bookmark, { onDelete: "CASCADE" })
  bookmarks: Bookmark[];

  @HasMany(() => Comment, { onDelete: "CASCADE" })
  comments: Comment[];

  @BelongsToMany(() => Post, () => Like)
  likePosts: Post[];

  @BelongsToMany(() => User, () => Follow, "followerId", "followingId")
  following: User[];

  @BelongsToMany(() => User, () => Follow, "followingId", "followerId")
  followers: User[];

  @BelongsToMany(() => ChatRoom, () => ChatMembers)
  ChatRooms: ChatRoom[];
}

export default User;
