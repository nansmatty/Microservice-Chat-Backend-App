import express from 'express';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Mail service is running on port ${PORT}`);
});
