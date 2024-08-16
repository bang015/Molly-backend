import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import Post from '../../post/models/post.model';
import User from '../../user/models/user.model';
import BaseModel from '../../common/models/base.model';

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
