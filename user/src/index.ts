import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { checkConnection } from './config/redis.js';
import userRoutes from './routes/userRoutes.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import cors from 'cors';

dotenv.config();

connectDB();
checkConnection();
connectRabbitMQ();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/user', userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`User service is running on port ${PORT}`);
});
