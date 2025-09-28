import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

dotenv.config();

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/v1/chat', chatRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Mail service is running on port ${PORT}`);
});
