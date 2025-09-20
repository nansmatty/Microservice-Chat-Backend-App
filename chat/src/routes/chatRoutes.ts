import express from 'express';
import { createNewChat } from '../controllers/chatControllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post('/message', isAuth, createNewChat);

export default router;
