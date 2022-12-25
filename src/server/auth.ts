import {Request} from 'express';
import jwt from 'jsonwebtoken';
import {expressjwt} from 'express-jwt';
import * as dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const createJwtToken = (username: string) => {
  return jwt.sign({username: username}, JWT_SECRET);
};

const auth = expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false,
});

export default auth;
