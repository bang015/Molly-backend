import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import BaseModel from '../../common/models/base.model';

@Table({
  tableName: 'Verification',
})
class Verification extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  code: string;

  @Column({ type: DataType.DATE, allowNull: false,})
  expiresAt: Date;
}
export default Verification; 