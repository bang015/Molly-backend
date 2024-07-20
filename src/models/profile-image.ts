import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from '../common/models/base.model';

@Table({ tableName: 'ProfileImage' })
class ProfileImage extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  path: string;
}

export default ProfileImage;
