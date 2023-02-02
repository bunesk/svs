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
  NonAttribute,
} from 'sequelize';
import {
  validateUsername,
  validateName,
  validateMatriculationNumber,
  validateEmail,
  validatePassword,
} from '../services/validators.js';
import Task from './Task.js';
import Team from './Team.js';
import {encryptPassword} from '../server/auth.js';
import {getGenderLabel} from '../services/gender.js';

declare type gender = 'male' | 'female' | 'diverse';
declare type genderLabel = 'Männlich' | 'Weiblich' | 'Divers' | 'Keine Angabe';

/**
 * A user is a student, tutor or administrator.
 */
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // Since TS cannot determine model attributes at compile time
  // we have to declare them here virtually
  declare username: string;
  declare firstName: string;
  declare lastName: string;
  declare readonly fullName: NonAttribute<string>;
  declare gender: gender;
  declare readonly genderLabel: NonAttribute<genderLabel>;
  declare matriculationNumber: string | null;
  declare email: string;
  declare password: string;
  declare isAdmin: CreationOptional<boolean>;
  declare isTutor: CreationOptional<boolean>;
  declare role: NonAttribute<string>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here virtually
  // association with task
  declare Tasks?: NonAttribute<Task[]>;
  declare getTasks: HasManyGetAssociationsMixin<Task>;
  declare addTask: HasManyAddAssociationMixin<Task, number>;
  declare addTasks: HasManyAddAssociationsMixin<Task, number>;
  declare setTasks: HasManySetAssociationsMixin<Task, number>;
  declare removeTask: HasManyRemoveAssociationMixin<Task, number>;
  declare removeTasks: HasManyRemoveAssociationsMixin<Task, number>;
  declare hasTask: HasManyHasAssociationMixin<Task, number>;
  declare hasTasks: HasManyHasAssociationsMixin<Task, number>;
  declare countTasks: HasManyCountAssociationsMixin;
  declare createTask: HasManyCreateAssociationMixin<Task, 'TaskId'>;
  // association with event
  declare Events?: NonAttribute<Event[]>;
  declare getEvents: HasManyGetAssociationsMixin<Event>;
  declare addEvent: HasManyAddAssociationMixin<Event, number>;
  declare addEvents: HasManyAddAssociationsMixin<Event, number>;
  declare setEvents: HasManySetAssociationsMixin<Event, number>;
  declare removeEvent: HasManyRemoveAssociationMixin<Event, number>;
  declare removeEvents: HasManyRemoveAssociationsMixin<Event, number>;
  declare hasEvent: HasManyHasAssociationMixin<Event, number>;
  declare hasEvents: HasManyHasAssociationsMixin<Event, number>;
  declare countEvents: HasManyCountAssociationsMixin;
  declare createEvent: HasManyCreateAssociationMixin<Event, 'EventId'>;
  // association with team
  declare Teams?: NonAttribute<Team[]>;
  declare getTeams: HasManyGetAssociationsMixin<Team>;
  declare addTeam: HasManyAddAssociationMixin<Team, number>;
  declare addTeams: HasManyAddAssociationsMixin<Team, number>;
  declare setTeams: HasManySetAssociationsMixin<Team, number>;
  declare removeTeam: HasManyRemoveAssociationMixin<Team, number>;
  declare removeTeams: HasManyRemoveAssociationsMixin<Team, number>;
  declare hasTeam: HasManyHasAssociationMixin<Team, number>;
  declare hasTeams: HasManyHasAssociationsMixin<Team, number>;
  declare countTeams: HasManyCountAssociationsMixin;
  declare createTeam: HasManyCreateAssociationMixin<Team, 'TeamId'>;
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
  },
  genderLabel: {
    type: DataTypes.VIRTUAL,
    get(): genderLabel {
      return getGenderLabel(this.gender);
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
      if (value === 'Admin') {
        this.setDataValue('isAdmin', true);
        this.setDataValue('isTutor', false);
      } else if (value === 'Tutor') {
        this.setDataValue('isAdmin', false);
        this.setDataValue('isTutor', true);
      } else {
        this.setDataValue('isAdmin', false);
        this.setDataValue('isTutor', false);
      }
    },
  },
});

export default User;
