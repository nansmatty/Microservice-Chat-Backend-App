import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = () => {
	if (process.env.REDIS_URL!) {
		return process.env.REDIS_URL;
	} else {
		throw new Error('REDIS_URL is not defined');
	}
};

export const redis = new Redis(redisClient());

export const checkConnection = async () => {
	try {
		await redis.ping();
		console.log('✅Connected to Redis.');
		return true; // Connection successful
	} catch (error) {
		console.error('Error connecting to Redis:', error);
		return false; // Connection failed
	}
};
