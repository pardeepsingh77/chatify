import express from 'express';
import { checkUser, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup',signup)

router.get('/login',login)

router.get('/logout',logout)

router.put('/update-profile',protectRoute,updateProfile)

router.get('/check',protectRoute,checkUser)

export default router