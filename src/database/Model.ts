import db from './DatabaseConnection.js';
import {Model as SequelizeModel, ModelAttributes, DataTypes, BuildOptions, CreationOptional} from 'sequelize';
import {MakeNullishOptional} from 'sequelize/types/utils.js';

/**
 * The basic model class to inherit from for creating models.
 *
 * It inherits from the Sequelize model and extends it's functionality by adding an
 * automatically generated integer primary key field 'id'.
 *
 * @see https://sequelize.org/api/v6/class/src/model.js~model
 */
abstract class Model<
  TModelAttributes extends {} = any,
  TCreationAttributes extends {} = TModelAttributes
> extends SequelizeModel {
  // Since TS cannot determine model attributes at compile time
  // we have to declare them here virtually
  declare id: CreationOptional<number>;
  // these attributes are automatically created by Sequelize
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

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
      ...options,
    };
    // @ts-ignore
    return super.init(newAttributes, newOptions);
  }

  // override constructor to type-check model attributes
  // always construct new instances this way using the 'new' operator
  // using Model.create() instead doesn't provide you the attributes autocomplete
  constructor(values?: MakeNullishOptional<TCreationAttributes>, options?: BuildOptions) {
    super(values, options);
  }
}

export default Model;
