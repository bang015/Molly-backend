import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./user";

@Table({ tableName: "Follow" })
class Follow extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  followerId: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  followingId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Follow;
