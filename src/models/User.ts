import Model from '../database/Model';
import {DataTypes} from 'sequelize';
import {isEmail, hasOnlyLettersAndSpaces, isSecurePassword} from '../utils/validators';

/**
 * A user is a student, tutor or administrator.
 */
class User extends Model {
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

  private validateName(name: string) {
    if (name.length < 2) {
      throw Error('Namen müssen mindestens zwei Zeichen lang sein.');
    }
    if (!hasOnlyLettersAndSpaces(name)) {
      throw Error('Namen dürfen nur Buchstaben und Leerzeichen enthalten.');
    }
  }

  private validateMatricleNumber(number: string) {
    if (number.length !== 7) {
      throw Error('Matrikelnummer muss 7 Zeichen lang sein.');
    }
    if (!/^[0-9]*$/.test(number)) {
      throw Error('Matrikelnummer darf nur eine Ganzzahl sein.');
    }
  }

  private validateEmail(email: string) {
    if (!isEmail(email)) {
      throw Error('Die E-Mail-Adresse ist ungültig.');
    }
  }

  private validatePassword(password: string) {
    if (!isSecurePassword(password)) {
      throw Error('Die E-Mail-Adresse ist ungültig.');
    }
  }
}

User.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value: string) {
      this.validateName(value);
      this.setDataValue('lastName', value);
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value: string) {
      this.validateName(value);
      this.setDataValue('lastName', value);
    },
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'diverse'),
    allowNull: false,
  },
  matricleNumber: {
    type: DataTypes.STRING,
    set(value: string) {
      this.validateMatricleNumber(value);
      this.setDataValue('matricleNumber', value);
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value: string) {
      this.validateEmail(value);
      this.setDataValue('email', value);
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value: string) {
      this.validatePassword(value);
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
