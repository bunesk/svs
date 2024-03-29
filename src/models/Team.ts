import Model from '../database/Model.js';
import {
  DataTypes,
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
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  ForeignKey,
} from 'sequelize';
import Event from './Event.js';
import User from './User.js';

/**
 * A team is a group of students doing sheet tests together.
 */
class Team extends Model<InferAttributes<Team>, InferCreationAttributes<Team>> {
  // Since TS cannot determine model attributes at compile time
  // we have to declare them here virtually
  declare number: number;
  declare block: string;
  declare readonly name: NonAttribute<string>;
  declare commentAdmin: CreationOptional<string>;
  declare commentTeam: CreationOptional<string>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here virtually
  // association with event
  declare EventId: ForeignKey<Event['id']>;
  declare getEvent: BelongsToGetAssociationMixin<Event>;
  declare setEvent: BelongsToSetAssociationMixin<Event, number>;
  declare createEvent: BelongsToCreateAssociationMixin<Event>;
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
  declare createUser: BelongsToManyCreateAssociationMixin<User>;
}

Team.init({
  number: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  block: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.VIRTUAL,
    get(): string {
      return `Team ${this.block}-${this.number}`;
    },
    set(value) {
      throw new Error(`You can't set the 'name' value.`);
    },
  },
  commentAdmin: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  commentTeam: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
});

export default Team;
