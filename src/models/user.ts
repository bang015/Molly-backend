import {
  BeforeCreate,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  IsEmail,
  Table,
} from 'sequelize-typescript';
import ProfileImage from './profile-image';
import Post from './post';
import Bookmark from './bookmark.modal';
import Like from './like';
import Follow from './follow';
import ChatRoom from './chat-room';
import ChatMembers from './chat-users';
import Comment from './comment';
import bcrypt from 'bcrypt';
import { BaseModel } from '../common/models/base.model';

@Table({ tableName: 'User' })
export class User extends BaseModel {
  @IsEmail
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  nickname: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  introduce?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  profileImageId?: number;

  @BelongsTo(() => ProfileImage, 'profileImageId')
  profileImage!: ProfileImage;

  @HasMany(() => Post)
  posts: Post[];

  @HasMany(() => Bookmark, { onDelete: 'CASCADE' })
  bookmarks: Bookmark[];

  @HasMany(() => Comment, { onDelete: 'CASCADE' })
  comments: Comment[];

  @HasMany(() => Follow, 'followerId')
  following: User[];

  @HasMany(() => Follow, 'followingId')
  followers: User[];

  @BelongsToMany(() => Post, () => Like)
  likePosts: Post[];

  @BelongsToMany(() => ChatRoom, () => ChatMembers)
  ChatRooms: ChatRoom[];

  @BeforeCreate
  static async encryptPassword(user: User) {
    const encryptedPw = await bcrypt.hash(user.password, 10);
    user.password = encryptedPw;
  }
}

export default User;
