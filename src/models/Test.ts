import Model from '../database/Model.js';
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
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import Event from './Event.js';
import Task from './Task.js';

/**
 * A test has multiple tasks that need to be done by students.
 */
class Test extends Model<InferAttributes<Test>, InferCreationAttributes<Test>> {
  // Since TS cannot determine model attributes at compile time
  // we have to declare them here virtually
  declare number: number;
  declare readonly name: NonAttribute<string>;
  declare isSheet: CreationOptional<boolean>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here virtually
  // association with event
  declare EventId: ForeignKey<Event['id']>;
  declare getEvent: BelongsToGetAssociationMixin<Event>;
  declare setEvent: BelongsToSetAssociationMixin<Event, number>;
  declare createEvent: BelongsToCreateAssociationMixin<Event>;
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
}

Test.init({
  number: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  name: {
    type: DataTypes.VIRTUAL,
    get(): string {
      if (this.isSheet) {
        return `Blatt ${this.number}`;
      }
      return `Test ${this.number}`;
    },
    set(value) {
      throw new Error(`You can't set the 'name' value.`);
    },
  },
  isSheet: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

export default Test;
