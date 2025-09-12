import mongoose from 'mongoose';

const connectDB = async () => {
	const url = process.env.MONGODB_URI;

	if (!url) {
		throw new Error('url is not defined');
	}
	try {
		await mongoose.connect(url, {
			dbName: 'chat-microservice-app-user-service',
		});
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		process.exit(1);
	}
};

export default connectDB;
