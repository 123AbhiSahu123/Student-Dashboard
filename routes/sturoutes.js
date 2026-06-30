import express from 'express';
import {registerUser, loginUser, registerData, getProfile } from '../controllers/stuControllers.js' 
import { verifyToken } from "../middleware/stuMiddleware.js";
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/data', verifyToken, registerData);
router.get('/profile', verifyToken, getProfile);

export default router;