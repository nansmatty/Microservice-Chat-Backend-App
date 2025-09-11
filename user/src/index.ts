import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`User service is running on port ${PORT}`);
});
