import express from 'express';
import dotenv from 'dotenv';
import { startSentOTPConsumer } from './consumer.js';

const app = express();

dotenv.config();

startSentOTPConsumer();

app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Mail service is running on port ${PORT}`);
});
