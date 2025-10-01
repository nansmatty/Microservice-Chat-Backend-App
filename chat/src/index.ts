import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import chatRoutes from './routes/chatRoutes.js';
import { app, server } from './config/socket.js';

dotenv.config();

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/v1/chat', chatRoutes);

const PORT = process.env.PORT;

server.listen(PORT, () => {
	console.log(`Chat service is running on port ${PORT}`);
});
