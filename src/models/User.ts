import Model from '../database/Model';
import {DataTypes} from 'sequelize';

class User extends Model {
  declare first_name: string;
  declare last_name: string;
  declare is_admin: boolean;
  declare is_tutor: boolean;
}

User.init({
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  is_tutor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

export default User;
