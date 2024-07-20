import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import User from './user';
import Post from './post';
import { BaseModel } from '../common/models/base.model';

@Table({
  tableName: 'Bookmark',
})
class Bookmark extends BaseModel {
  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER, allowNull: false })
  postId: number;

  @BelongsTo(() => Post, 'postId')
  post: Post;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;
}
export default Bookmark;
