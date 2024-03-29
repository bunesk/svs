import {ModelStatic} from 'sequelize';
import Model from './Model.js';

const importModel = async (modelName: string): Promise<ModelStatic<Model>> => {
  return (await import(`../models/${modelName}.ts`)).default;
};

const oneToOne = (hasOne: ModelStatic<Model>, belongsTo: ModelStatic<Model>) => {
  hasOne.hasOne(belongsTo);
  belongsTo.belongsTo(hasOne);
};

const oneToMany = (hasMany: ModelStatic<Model>, belongsTo: ModelStatic<Model>) => {
  hasMany.hasMany(belongsTo);
  belongsTo.belongsTo(hasMany);
};

const manyToMany = (
  hasMany: ModelStatic<Model>,
  belongsToMany: ModelStatic<Model>,
  through?: string | ModelStatic<Model>
) => {
  if (!through) {
    through = hasMany.name + belongsToMany.name;
  }
  hasMany.belongsToMany(belongsToMany, {through: through});
  belongsToMany.belongsToMany(hasMany, {through: through});
};

/**
 * Sets the associations between models.
 * You can use the functions 'oneToOne', 'oneToMany' and 'manyToMany'.
 * For complexer association options create the relations yourself as mentioned
 * in the 'Sequelize' documentation.
 *
 * @see https://sequelize.org/docs/v6/core-concepts/assocs/
 */
const setAssociations = async () => {
  // dynamic model imports to prevent circular imports
  const User = await importModel('User');
  const Event = await importModel('Event');
  const Test = await importModel('Test');
  const Task = await importModel('Task');
  const Team = await importModel('Team');
  const UserTask = await importModel('UserTask');

  oneToMany(Event, Test);
  oneToMany(Test, Task);
  oneToMany(Event, Team);
  manyToMany(User, Event);
  manyToMany(User, Team);
  manyToMany(User, Task, UserTask);
};

export default setAssociations;
