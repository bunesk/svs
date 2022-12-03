import Model from '../database/Model.js';
import {
  DataTypes,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
} from 'sequelize';
import Test from './Test.js';

/**
 * A task is part of a test.
 */
class Task extends Model {
  // Since TS cannot determine model attributes at compile time
  // we have to declare them here virtually
  declare number: number;
  declare pointsMax: number;

  // Since TS cannot determine model association at compile time
  // we have to declare them here virtually
  // association with test
  declare getTest: BelongsToGetAssociationMixin<Test>;
  declare setTest: BelongsToSetAssociationMixin<Test, number>;
  declare createTest: BelongsToCreateAssociationMixin<Test>;
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
