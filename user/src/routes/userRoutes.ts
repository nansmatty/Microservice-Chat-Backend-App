import express from 'express';
import { getAllUsers, getUser, getUserProfile, loginUser, updateName, verifyOTP } from '../controller/userControllers.js';
import { isAuth } from '../middleware/isAuth.js';
const router = express.Router();

router.post('/login', loginUser);
router.post('/verify', verifyOTP);
router.get('/me', isAuth, getUserProfile);
router.get('/all', isAuth, getAllUsers);
router.get('/:id', getUser);
router.put('/update/me', isAuth, updateName);

export default router;
