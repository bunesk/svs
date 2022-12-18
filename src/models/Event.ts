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
} from 'sequelize';
import User from './User.js';
import Test from './Test.js';

/**
 * An event is a lecture students can attend.
 */
class Event extends Model {
  // Since TS cannot determine model attributes at compile time
  // we have to declare them here virtually
  declare name: string;
  declare password: string;
  declare amountTests: number;
  declare amountSheets: number;
  declare pointsMax: number;
  declare pointsPassed: number;
  declare visible: CreationOptional<boolean>;

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
  // association with user
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
});

export default Event;
