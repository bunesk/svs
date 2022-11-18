import * as dotenv from 'dotenv';
dotenv.config();

import ldap from 'ldapjs';

console.log(process);
const LDAP_URL = process.env.LDAP_URL || '';
const LDAP_PATH = process.env.LDAP_PATH || '';

export const login = () => {
  if (!LDAP_URL || !LDAP_PATH) {
    throw Error('No LDAP url or path provided.');
  }
  const client = ldap.createClient({
    url: LDAP_URL,
  });
  client.on('error', (err: any) => {
    throw Error(err);
  });
};
