import Model from '../database/Model';
import Event from './Event';
import {DataTypes} from 'sequelize';

/**
 * A team is a group of students doing sheet tests together.
 */
class Team extends Model {
  declare number: number;
  declare block: string;
  declare commentAdmin: string;
  declare commentTeam: string;
}

Team.hasOne(Event, {foreignKey: 'eventId'});

Team.init({
  number: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  block: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  commentAdmin: {
    type: DataTypes.STRING,
  },
  commentTeam: {
    type: DataTypes.STRING,
  },
});

export default Team;
