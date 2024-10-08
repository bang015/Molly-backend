import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import Post from './post.model';
import Tag from './tag.model';
import BaseModel from '../../common/models/base.model';

@Table({ tableName: 'PostTag' })
class PostTag extends BaseModel {
  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER, allowNull: false })
  postId: number;

  @ForeignKey(() => Tag)
  @Column({ type: DataType.INTEGER, allowNull: false })
  tagId: number;
}

export default PostTag;
