import Model from '../database/Model';
import {DataTypes} from 'sequelize';
import {
  validateUsername,
  validateName,
  validateMatriculationNumber,
  validateEmail,
  validatePassword,
} from '../services/validators';

/**
 * A user is a student, tutor or administrator.
 */
class User extends Model {
  declare username: string;
  declare firstName: string;
  declare lastName: string;
  declare gender: gender;
  declare matriculationNumber: string;
  declare email: string;
  declare password: string;
  declare activationCode: string;
  declare isAdmin: boolean;
  declare isTutor: boolean;

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    set(value: string) {
      validateUsername(value);
      this.setDataValue('username', value);
    },
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value: string) {
      validateName(value);
      this.setDataValue('firstName', value);
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value: string) {
      validateName(value);
      this.setDataValue('lastName', value);
    },
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'diverse'),
    allowNull: false,
  },
  matriculationNumber: {
    type: DataTypes.STRING,
    set(value: string) {
      validateMatriculationNumber(value);
      this.setDataValue('matricleNumber', value);
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value: string) {
      validateEmail(value);
      this.setDataValue('email', value);
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value: string) {
      validatePassword(value);
      this.setDataValue('password', value);
    },
  },
  activationCode: {
    type: DataTypes.STRING,
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
