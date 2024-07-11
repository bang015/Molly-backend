import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

@Table({ tableName: "ProfileImage" })
class ProfileImage extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  @AllowNull(false)
  name: string;

  @Column(DataType.STRING)
  @AllowNull(false)
  type: string;

  @Column(DataType.STRING)
  @AllowNull(false)
  path: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default ProfileImage;
