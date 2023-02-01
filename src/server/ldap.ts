import * as dotenv from 'dotenv';
dotenv.config();

import ldap from 'ldapjs';

const LDAP_URL = process.env.LDAP_URL || '';
const LDAP_PATH = process.env.LDAP_PATH || '';

const timeout = 3000;

/**
 * Tries to login with given credentials to the ldap server.
 * It returns a promise with the user data of the connected user if succeeds or else undefined.
 *
 * @param username username
 * @param password password
 * @returns user data on success
 */
export const login = async (username: string, password: string): Promise<any> => {
  let resolve: Function;
  const promise = new Promise((res, rej) => {
    resolve = res;
  });
  if (!LDAP_URL || !LDAP_PATH) {
    console.log('No LDAP url or path provided.');
    return resolve!();
  }
  const client = ldap.createClient({
    url: LDAP_URL,
    // also allow unauthorized because tls signature for
    // university ldap is expired
    tlsOptions: {rejectUnauthorized: false},
    connectTimeout: timeout,
    timeout: timeout,
  });
  client.on('connect', () => {
    const options = {
      attributes: ['givenName', 'sn', 'mail'],
    };
    const searchBase = `uid=${username},${LDAP_PATH}`;
    client.bind(searchBase, password, (error) => {
      if (error) {
        console.log(error.message);
        return resolve();
      }
    });
    client.search(searchBase, options, (error, result) => {
      if (error) {
        console.log(error.message);
        return resolve();
      }

      result.on('searchEntry', (entry) => {
        let matriculationNumber = typeof entry.object.mail === 'string' ? entry.object.mail.split('@')[0] : '';
        matriculationNumber = Number.isNaN(Number(matriculationNumber)) ? '' : matriculationNumber;
        return resolve({
          firstName: entry.object.givenName,
          lastName: entry.object.sn,
          email: entry.object.mail,
          matriculationNumber: matriculationNumber,
        });
      });
      result.on('error', (err) => {
        console.error('error on ldap search: ' + err.message);
        return resolve();
      });
    });
  });
  client.on('error', (error: any) => {
    console.log('error on ldap connect: ' + error.message);
    return resolve();
  });
  return await promise;
};
