import { BaseModel } from '../common/models/base.model';
import Bookmark from './bookmark.modal';
import Comment from './comment';
import Like from './like';
import PostMedia from './post-media';
import PostTag from './post-tag';
import Tag from './tag';
import User from './user';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'Post' })
class Post extends BaseModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: DataType.TEXT, allowNull: false })
  content: string;

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
