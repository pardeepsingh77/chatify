import express from 'express';
import dotenv from 'dotenv'
import path from 'path'
import authRoutes from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'
import { connectDB } from '../lib/db.js';
import { ENV } from '../lib/env.js';
import cors from 'cors';
import { app, server } from '../lib/socket.js';
dotenv.config();

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000

app.use(express.json({ limit: '50mb' })); // req.body
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin : [ENV.CLIENT_URL],
  credentials : true,  
}))

app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoute)

// make ready for deployment
if(ENV.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../frontend/dist')))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,'../frontend/dist/index.html'))
    })
}

server.listen(PORT,()=> {
    console.log(`Server is running on port ${PORT}`) 
    connectDB();
})