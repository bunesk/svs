import {DataTypes, ForeignKey, InferAttributes, InferCreationAttributes} from 'sequelize';
import Model from '../database/Model.js';
import Task from './Task.js';
import User from './User.js';

class UserTask extends Model<InferAttributes<UserTask>, InferCreationAttributes<UserTask>> {
  declare points: number;
  // foreign keys
  declare UserId: ForeignKey<User['id']>;
  declare TaskId: ForeignKey<Task['id']>;
}

UserTask.init({
  points: {
    type: DataTypes.FLOAT.UNSIGNED,
    allowNull: false,
  },
});

export default UserTask;
