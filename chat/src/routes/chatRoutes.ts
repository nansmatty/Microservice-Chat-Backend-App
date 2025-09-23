import express from 'express';
import { createNewChat, getAllChats } from '../controllers/chatControllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post('/message', isAuth, createNewChat);
router.get('/all', isAuth, getAllChats);

export default router;
