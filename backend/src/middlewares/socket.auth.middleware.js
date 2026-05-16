import jwt from 'jsonwebtoken'
import User from '../modals/user.modal.js';
import { ENV } from '../../lib/env.js';


export const socketAuthMiddleware = async (socket , next) => {
    try {
        const token = socket.handshake.headers.cookie?.split("; ").find((row)=>row.startsWith("jwt="))?.split("=")[1];
        if(!token){
            console.log('Socket connection rejected: No token provided');
            return next(new Error("UNauthorized - No Token Provided"))
        }

        const decoded = jwt.verify(token,ENV.JWT_SECRET)
        if(!decoded){
            console.log("Socket connection rejected: Invalid token")
            return next(new Error("Unauthorized - invalid token"))
        }
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            console.log("Socket connection rejected: User not found")
            return next(new Error("Unauthorized - User not found"))
        }
        socket.user = user;
        socket.userId = user._id.toString();
        console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`)

        next()
    } catch (error) {
        console.log("Socket connection error:", error);
        next(new Error("Unauthorized - Socket connection error"));
    }
}