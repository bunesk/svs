import {ModelStatic} from 'sequelize';
import Model from './Model';

const importModel = async (modelName: string): Promise<ModelStatic<Model>> => {
  return (await import(`../models/${modelName}.ts`)).default;
};

const oneToOne = (
  hasOne: ModelStatic<Model>,
  belongsTo: ModelStatic<Model>
) => {
  hasOne.hasOne(belongsTo);
  belongsTo.belongsTo(hasOne);
};

const oneToMany = (
  hasMany: ModelStatic<Model>,
  belongsTo: ModelStatic<Model>
) => {
  hasMany.hasMany(belongsTo);
  belongsTo.belongsTo(hasMany);
};

const manyToMany = (
  hasMany: ModelStatic<Model>,
  belongsToMany: ModelStatic<Model>,
  through?: string
) => {
  if (!through) {
    through = hasMany.constructor.name + belongsToMany.constructor.name;
  }
  hasMany.belongsToMany(hasMany, {through: through});
  belongsToMany.belongsToMany(belongsToMany, {through: through});
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

  oneToMany(User, Test);
  oneToMany(Event, Test);
  oneToMany(Test, Task);
  // manyToMany(User, Event);
  // manyToMany(User, Team);
};

export default setAssociations;
