import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

const app = express();

dotenv.config();

connectDB();

app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Mail service is running on port ${PORT}`);
});
