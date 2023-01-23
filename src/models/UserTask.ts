import {DataTypes} from 'sequelize';
import Model from '../database/Model.js';

class UserTask extends Model {
  declare points: number;
  // foreign keys
  declare UserId: number;
  declare TaskId: number;
}

UserTask.init({
  points: {
    type: DataTypes.FLOAT.UNSIGNED,
    allowNull: false,
  },
});

export default UserTask;
