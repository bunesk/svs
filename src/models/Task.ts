import Model from '../database/Model.js';
import {
  DataTypes,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
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
} from 'sequelize';
import Test from './Test.js';
import User from './User.js';

/**
 * A task is part of a test.
 */
class Task extends Model {
  // Since TS cannot determine model attributes at compile time
  // we have to declare them here virtually
  declare number: number;
  declare readonly name: CreationOptional<string>;
  declare pointsMax: number;

  // Since TS cannot determine model association at compile time
  // we have to declare them here virtually
  // association with test
  declare TestId: number;
  declare getTest: BelongsToGetAssociationMixin<Test>;
  declare setTest: BelongsToSetAssociationMixin<Test, number>;
  declare createTest: BelongsToCreateAssociationMixin<Test>;
  // association with user
  declare Users: CreationOptional<User[]>;
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

Task.init({
  number: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  name: {
    type: DataTypes.VIRTUAL,
    get(): string {
      return `Aufgabe ${this.number}`;
    },
    set(value) {
      throw new Error(`You can't set the 'name' value.`);
    },
  },
  pointsMax: {
    type: DataTypes.FLOAT.UNSIGNED,
    allowNull: false,
  },
});

export default Task;
