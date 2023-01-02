import Model from '../database/Model.js';
import Event from './Event.js';
import {
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {
  validateUsername,
  validateName,
  validateMatriculationNumber,
  validateEmail,
  validatePassword,
} from '../services/validators.js';
import Test from './Test.js';
import Team from './Team.js';
import {encryptPassword} from '../server/auth.js';

declare type gender = 'male' | 'female' | 'diverse';
declare type genderLabel = 'Männlich' | 'Weiblich' | 'Divers';

/**
 * A user is a student, tutor or administrator.
 */
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // Since TS cannot determine model attributes at compile time
  // we have to declare them here virtually
  declare username: string;
  declare firstName: string;
  declare lastName: string;
  declare fullName: string;
  declare gender: gender;
  declare genderLabel: genderLabel;
  declare matriculationNumber: string | null;
  declare email: string;
  declare password: string;
  declare isAdmin: CreationOptional<boolean>;
  declare isTutor: CreationOptional<boolean>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here virtually
  // association with test
  declare getTests: HasManyGetAssociationsMixin<Test>;
  declare addTest: HasManyAddAssociationMixin<Test, number>;
  declare addTests: HasManyAddAssociationsMixin<Test, number>;
  declare setTests: HasManySetAssociationsMixin<Test, number>;
  declare removeTest: HasManyRemoveAssociationMixin<Test, number>;
  declare removeTests: HasManyRemoveAssociationsMixin<Test, number>;
  declare hasTest: HasManyHasAssociationMixin<Test, number>;
  declare hasTests: HasManyHasAssociationsMixin<Test, number>;
  declare countTests: HasManyCountAssociationsMixin;
  declare createTest: HasManyCreateAssociationMixin<Test, 'ownerId'>;
  // association with event
  declare getEvents: HasManyGetAssociationsMixin<Event>;
  declare addEvent: HasManyAddAssociationMixin<Event, number>;
  declare addEvents: HasManyAddAssociationsMixin<Event, number>;
  declare setEvents: HasManySetAssociationsMixin<Event, number>;
  declare removeEvent: HasManyRemoveAssociationMixin<Event, number>;
  declare removeEvents: HasManyRemoveAssociationsMixin<Event, number>;
  declare hasEvent: HasManyHasAssociationMixin<Event, number>;
  declare hasEvents: HasManyHasAssociationsMixin<Event, number>;
  declare countEvents: HasManyCountAssociationsMixin;
  declare createEvent: HasManyCreateAssociationMixin<Event, 'ownerId'>;
  // association with team
  declare getTeams: HasManyGetAssociationsMixin<Team>;
  declare addTeam: HasManyAddAssociationMixin<Team, number>;
  declare addTeams: HasManyAddAssociationsMixin<Team, number>;
  declare setTeams: HasManySetAssociationsMixin<Team, number>;
  declare removeTeam: HasManyRemoveAssociationMixin<Team, number>;
  declare removeTeams: HasManyRemoveAssociationsMixin<Team, number>;
  declare hasTeam: HasManyHasAssociationMixin<Team, number>;
  declare hasTeams: HasManyHasAssociationsMixin<Team, number>;
  declare countTeams: HasManyCountAssociationsMixin;
  declare createTeam: HasManyCreateAssociationMixin<Team, 'ownerId'>;
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
  fullName: {
    type: DataTypes.VIRTUAL,
    get(): string {
      return `${this.firstName} ${this.lastName}`;
    },
    set(value) {
      throw new Error(`You can't set the 'fullName' value.`);
    },
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'diverse'),
    allowNull: false,
  },
  genderLabel: {
    type: DataTypes.VIRTUAL,
    get(): genderLabel {
      switch (this.gender) {
        case 'male':
          return 'Männlich';
        case 'female':
          return 'Weiblich';
      }
      return 'Divers';
    },
    set(value) {
      throw new Error(`You can't set the 'genderLabel' value.`);
    },
  },
  matriculationNumber: {
    type: DataTypes.STRING,
    set(value: string) {
      validateMatriculationNumber(value);
      this.setDataValue('matriculationNumber', value);
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
      const password = encryptPassword(value);
      this.setDataValue('password', password);
    },
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
  role: {
    type: DataTypes.VIRTUAL,
    get(): string {
      if (this.isAdmin) {
        return 'Admin';
      }
      if (this.isTutor) {
        return 'Tutor';
      }
      return 'Student';
    },
    set(value) {
      throw new Error(`You can't set the 'role' value.`);
    },
  },
});

export default User;
