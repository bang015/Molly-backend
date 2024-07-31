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
import Comment from '../../comment/models/comment.model';
import bcrypt from 'bcrypt';
import Bookmark from '../../bookmark/models/bookmark.model';
import Post from '../../post/models/post.model';
import ChatRoom from '../../chat/models/chat-room.model';
import Follow from '../../follow/models/follow.model';
import Like from '../../like/models/like.model';
import ProfileImage from './profile-image.model';
import ChatMembers from '../../chat/models/chat-members.model';
import BaseModel from '../../common/models/base.model';

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

  @HasMany(() => ChatMembers, 'userId')
  ChatRooms: ChatRoom[];

  @BelongsToMany(() => Post, () => Like)
  likePosts: Post[];

  @BeforeCreate
  static async encryptPassword(user: User) {
    const encryptedPw = await bcrypt.hash(user.password, 10);
    user.password = encryptedPw;
  }
}

export default User;
