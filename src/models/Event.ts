import Model from '../database/Model.js';
import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManySetAssociationsMixin,
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
import User from './User.js';
import Team from './Team.js';
import Test from './Test.js';
import {validatePassword} from '../services/validators.js';
import {encryptPassword} from '../server/auth.js';

/**
 * An event is a lecture students can attend.
 */
class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
  // Since TS cannot determine model attributes at compile time
  // we have to declare them here virtually
  declare name: string;
  declare password: string;
  declare amountTests: number;
  declare amountSheets: number;
  declare pointsMax: number;
  declare pointsPassed: number;
  declare visible: CreationOptional<boolean>;
  declare readonly visibleLabel: NonAttribute<boolean>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here virtually
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
  // association with test
  declare Tests?: NonAttribute<Test[]>;
  declare getTests: HasManyGetAssociationsMixin<Test>;
  declare addTest: HasManyAddAssociationMixin<Test, number>;
  declare addTests: HasManyAddAssociationsMixin<Test, number>;
  declare setTests: HasManySetAssociationsMixin<Test, number>;
  declare removeTest: HasManyRemoveAssociationMixin<Test, number>;
  declare removeTests: HasManyRemoveAssociationsMixin<Test, number>;
  declare hasTest: HasManyHasAssociationMixin<Test, number>;
  declare hasTests: HasManyHasAssociationsMixin<Test, number>;
  declare countTests: HasManyCountAssociationsMixin;
  declare createTest: HasManyCreateAssociationMixin<Test, 'TestId'>;
  // association with user
  declare Users?: NonAttribute<User[]>;
  declare getUsers: BelongsToManyGetAssociationsMixin<User>;
  declare addUser: BelongsToManyAddAssociationMixin<User, number>;
  declare addUsers: BelongsToManyAddAssociationsMixin<User, number>;
  declare setUsers: BelongsToManySetAssociationsMixin<User, number>;
  declare removeUser: BelongsToManyRemoveAssociationMixin<User, number>;
  declare removeUsers: BelongsToManyRemoveAssociationsMixin<User, number>;
  declare hasUser: BelongsToManyHasAssociationMixin<User, number>;
  declare hasUsers: BelongsToManyHasAssociationsMixin<User, number>;
  declare countUsers: BelongsToManyCountAssociationsMixin;
  declare createUser: BelongsToManyCreateAssociationMixin<Test>;
}

Event.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
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
  amountTests: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  amountSheets: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  pointsMax: {
    type: DataTypes.FLOAT.UNSIGNED,
    allowNull: false,
  },
  pointsPassed: {
    type: DataTypes.FLOAT.UNSIGNED,
    allowNull: false,
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  visibleLabel: {
    type: DataTypes.VIRTUAL,
    get(): string {
      if (this.visible) {
        return 'Ja';
      }
      return 'Nein';
    },
    set(value) {
      throw new Error(`You can't set the 'visibleLabel' value.`);
    },
  },
});

export default Event;
