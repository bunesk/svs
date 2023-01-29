import {Request} from 'express';
import jwt from 'jsonwebtoken';
import {expressjwt} from 'express-jwt';
import crypto from 'node:crypto';
import * as dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Attributes to use if sql select is called for user to prevent
 * the password hash be sent to the frontend
 */
export const userSelectAttributes = [
  'createdAt',
  'email',
  'firstName',
  'fullName',
  'gender',
  'genderLabel',
  'id',
  'isAdmin',
  'isTutor',
  'lastName',
  'matriculationNumber',
  'role',
  'updatedAt',
  'username',
];

/**
 * Creates a jwt token by given username and jwt secret.
 *
 * @param username username
 * @returns jwt token
 */
export const createJwtToken = (username: string) => {
  return jwt.sign({username: username}, JWT_SECRET);
};

/**
 * Encrypts a given password using SHA-256 algorithm.
 *
 * @param password password
 * @returns encrpyted password
 */
export const encryptPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('base64');
};

/**
 * Express request handler for jwt using HS-256 algorithm.
 */
const auth = expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false,
});

export default auth;
