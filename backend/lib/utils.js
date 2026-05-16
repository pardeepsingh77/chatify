import jwt from 'jsonwebtoken';
import { ENV } from './env.js';
export const generateToken = (userId) => {

    const {JWT_SECRET} = ENV;
    if(!JWT_SECRET) throw new Error('JWT_SECRET is not configured')

    const token = jwt.sign({userId},JWT_SECRET,{
        expiresIn: "7d"
    });
    
    return token;
}
