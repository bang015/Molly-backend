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
import Post from "./post";
import User from "./user";

@Table({ tableName: "Like" })
class Like extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Post)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  postId: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  userId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Like;
