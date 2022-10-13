import {Sequelize} from 'sequelize';
import mysql from 'mysql2';
import * as dotenv from 'dotenv';
dotenv.config();

const DB_NAME = process.env.DB_NAME || 'svs';
const DB_USER = process.env.DB_USER as string;
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT || 3306);

/**
 * The basic connection to the MySQL database. For connecting Sequelize will be used.
 * The configuration will be received from the .env file:
 *
 * - DB_NAME: name of the database (will be automatically created if it doesn't exist, default: 'svs')
 * - DB_USER: user to login to the database
 * - DB_PASSWORD: the user's password to login to the database
 * - DB_HOST: address of the host
 * - DB_PORT: host address port (default: 3306)
 *
 * Before using the connection be sure to await the 'connectionEstabilshed' promise.
 * You can access the API of the Sequalize object using the 'api' property.
 */
class DatabaseConnection {
  /**
   * Sequelize API Object
   * @see https://sequelize.org/api/v6/class/src/sequelize.js~sequelize
   */
  api: Sequelize;

  /**
   * Promise which will be resolved if the connection to the database is established successfully.
   * It rejects if the connection attempt fails.
   * Before you use the database connection for something await this promise to ensure it's working.
   */
  connectionEstablished: Promise<any>;

  private resolveConnectionEstablished: Function = () => {};
  private rejectConnectionEstablished: Function = () => {};

  constructor() {
    this.connectionEstablished = new Promise((resolve, reject) => {
      this.resolveConnectionEstablished = resolve;
      this.rejectConnectionEstablished = (reason: any) => {
        if (reason?.parent?.code === 'ER_BAD_DB_ERROR') {
          this.createDatabase(reject);
        } else {
          reject(reason);
        }
      };
    });
    this.api = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'mysql',
    });
    this.authenticate();
  }

  private authenticate() {
    this.api
      .authenticate()
      .then(() => this.syncTables())
      .then(() => this.resolveConnectionEstablished())
      .catch((reason) => this.rejectConnectionEstablished(reason));
  }

  private createDatabase(reject: Function) {
    const connection = mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });
    connection.execute('CREATE DATABASE `' + DB_NAME + '`', (error: any) => {
      if (error) {
        reject(`Error while creating database "${DB_NAME}"`);
      } else {
        this.resolveConnectionEstablished();
      }
    });
  }

  private async syncTables() {
    return await this.api.sync();
  }
}

// export instance to ensure only one instance exists
export default new DatabaseConnection();
