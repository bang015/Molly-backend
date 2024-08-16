import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import Post from '../../post/models/post.model';
import User from '../../user/models/user.model';
import BaseModel from '../../common/models/base.model';

@Table({ tableName: 'Like' })
class Like extends BaseModel {
  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER, allowNull: false })
  postId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;
}

export default Like;
