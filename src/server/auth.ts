import {Request} from 'express';
import jwt from 'jsonwebtoken';
import {expressjwt} from 'express-jwt';
import * as dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

const getTokenFromHeader = (req: Request) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
};

export const createJwtToken = (username: string) => {
  return jwt.sign({username: username}, JWT_SECRET);
};

const auth = {
  required: expressjwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
    getToken: getTokenFromHeader,
  }),
  optional: expressjwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
};

export default auth;
