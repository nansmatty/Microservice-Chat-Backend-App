import express from 'express';
import { loginUser, verifyOTP } from '../controller/userControllers.js';
const router = express.Router();

router.post('/login', loginUser);
router.post('/verify', verifyOTP);

export default router;
