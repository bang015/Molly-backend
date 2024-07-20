import { BelongsToMany, Column, DataType, Table } from 'sequelize-typescript';
import Post from './post';
import PostTag from './post-tag';
import { BaseModel } from '../common/models/base.model';

@Table({ tableName: 'Tag' })
class Tag extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @BelongsToMany(() => Post, () => PostTag)
  posts: Post[];
}

export default Tag;
