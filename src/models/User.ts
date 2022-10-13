import Model from '../database/Model';
import {DataTypes} from 'sequelize';

class User extends Model {
  declare firstName: string;
  declare lastName: string;
  declare isAdmin: boolean;
  declare isTutor: boolean;
}

User.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isTutor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

export default User;
