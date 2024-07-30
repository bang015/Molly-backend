import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import Post from './post.model';
import BaseModel from '../../common/models/base.model';

@Table({ tableName: 'PostMedia' })
class PostMedia extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  path: string;

  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER, allowNull: false })
  postId: number;

  @BelongsTo(() => Post, { onDelete: 'CASCADE' })
  post: Post;
}

export default PostMedia;
