import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { checkConnection } from './config/redis.js';

dotenv.config();

connectDB();
checkConnection();

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`User service is running on port ${PORT}`);
});
