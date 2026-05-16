import { Server } from "socket.io";
import http from 'http'
import express from 'express'
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../src/middlewares/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    }
});

io.use(socketAuthMiddleware);

export function getReceiverSocketId(userId) {
    return userSocketmap[userId]
}

const userSocketmap = {};

io.on("connection", (socket) => {
    console.log("User connected: ", socket.user.fullName)
    const userId = socket.userId
    userSocketmap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketmap))

    // with socket.on we listen for events from clients
    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.user.fullName)
        delete userSocketmap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketmap))
    });
})

export { io, app, server }