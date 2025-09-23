import express from 'express';
import { createNewChat, getAllChats, sendMessage } from '../controllers/chatControllers.js';
import { isAuth } from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/message', isAuth, createNewChat);
router.get('/all', isAuth, getAllChats);
router.post('/send', isAuth, upload.single('image'), sendMessage);

export default router;
