import Model from '../database/Model';
import Test from './Test';
import {DataTypes} from 'sequelize';

/**
 * A task is part of a test.
 */
class Task extends Model {
  declare number: number;
  declare pointsMax: number;
}

Task.init({
  number: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  pointsMax: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
});

export default Task;
