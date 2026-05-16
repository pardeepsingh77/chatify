import jwt from 'jsonwebtoken'
import { ENV } from '../../lib/env.js';
import User from '../modals/user.modal.js';

export const protectRoute = async (req,res,next) => {
    try{
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
        if(!token){
            return res.status(401).json({message: "Unauthorised - No Token Provided"})
        }
        const decoded = jwt.verify(token,ENV.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: "Unauthorised - Invalid Token"})
        };
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({message: "User Not Found"})
        }
        req.user = user;
        next();
    }catch(err){
        console.log("Error in protectRoute middleware",err)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}