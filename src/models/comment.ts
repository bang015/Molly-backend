import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import Post from './post';
import User from './user';
import { BaseModel } from '../common/models/base.model';

@Table({ tableName: 'Comment' })
class Comment extends BaseModel {
  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER, allowNull: false })
  postId: number;

  @BelongsTo(() => Post, { onDelete: 'CASCADE', foreignKey: 'postId' })
  post: Post;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User, { onDelete: 'CASCADE', foreignKey: 'userId' })
  user: User;

  @Column({ type: DataType.TEXT, allowNull: false })
  content: string;

  @ForeignKey(() => Comment)
  @Column({ type: DataType.INTEGER, allowNull: true })
  commentId?: number;

  @BelongsTo(() => Comment, {
    onDelete: 'CASCADE',
    foreignKey: 'commentId',
    as: 'parentComment',
  })
  parentComment: Comment;

  @HasMany(() => Comment, {
    foreignKey: 'commentId',
    as: 'subComments',
  })
  subComments: Comment[];
}

export default Comment;
