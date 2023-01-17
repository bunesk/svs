import {DataTypes} from 'sequelize';
import Model from '../database/Model.js';

class UserTask extends Model {
  declare points: number;
}

UserTask.init({
  points: {
    type: DataTypes.FLOAT.UNSIGNED,
    allowNull: false,
  },
});
