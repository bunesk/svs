import Model from '../database/Model';
import Test from './Test';
import {DataTypes} from 'sequelize';

/**
 * An event is a lecture students can attend.
 */
class Event extends Model {
  declare name: string;
  declare password: string;
  declare amountTests: number;
  declare amountSheets: number;
  declare pointsMax: number;
  declare pointsPassed: number;
  declare visible: boolean;
}

Event.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amountTests: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  amountSheets: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  pointsMax: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  pointsPassed: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

export default Event;
