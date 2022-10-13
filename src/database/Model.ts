import db from './DatabaseConnection';
import {Model as SequelizeModel, ModelAttributes, DataTypes} from 'sequelize';

/**
 * The basic model class to inherit from for creating models.
 *
 * It inherits from the Sequelize model and extends it's functionality by adding an
 * automatically generated integer primary key field 'id'.
 *
 * It also activates he paranoid mode where items can be just soft-deleted.
 * @see https://sequelize.org/docs/v6/core-concepts/paranoid/
 *
 * @see https://sequelize.org/api/v6/class/src/model.js~model
 */
abstract class Model extends SequelizeModel {
  declare id: number;
  declare active: boolean;

  static init(attributes: ModelAttributes<any, any>, options?: object): any {
    const newAttributes = {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      ...attributes,
    };
    const newOptions = {
      sequelize: db.api,
      paranoid: true,
      ...options,
    };
    // @ts-ignore
    return super.init(newAttributes, newOptions);
  }
}

export default Model;
