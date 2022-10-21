import Model from '../database/Model';
import {DataTypes} from 'sequelize';

/**
 * A test has multiple tasks that need to be done by students.
 */
class Test extends Model {
  declare points: number;
  declare testNumber: number;
  declare walkingNumber: number;
  declare isSheet: boolean;
}

Test.init({
  points: {
    type: DataTypes.FLOAT.UNSIGNED,
    allowNull: false,
  },
  testNumber: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  walkingNumber: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  isSheet: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

export default Test;
