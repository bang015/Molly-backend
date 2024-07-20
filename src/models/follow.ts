import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import User from './user';
import { BaseModel } from '../common/models/base.model';

@Table({ tableName: 'Follow' })
class Follow extends BaseModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  followerId: number;

  @BelongsTo(() => User, 'followerId')
  follower: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  followingId: number;

  @BelongsTo(() => User, 'followingId')
  following: User;
}

export default Follow;
