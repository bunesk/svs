import {Request} from 'express';
import jwt from 'jsonwebtoken';
import {expressjwt} from 'express-jwt';
import crypto from 'node:crypto';
import * as dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const createJwtToken = (username: string) => {
  return jwt.sign({username: username}, JWT_SECRET);
};

export const encryptPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('base64');
};

const auth = expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false,
});

export default auth;
