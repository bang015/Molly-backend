import Bookmark from '../../bookmark/models/bookmark.model';
import User from '../../user/models/user.model';
import Comment from '../../comment/models/comment.model';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import Like from '../../like/models/like.model';
import PostMedia from './post-media.model';
import PostTag from './post-tag.model';
import Tag from './tag.model';
import BaseModel from '../../common/models/base.model';

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
