import ampqlib from 'amqplib';

let channel: ampqlib.Channel;

export const connectRabbitMQ = async () => {
	try {
		const connection = await ampqlib.connect({
			protocol: 'amqp',
			hostname: process.env.RABBITMQ_HOST,
			port: parseInt(process.env.RABBITMQ_PORT!),
			username: process.env.RABBITMQ_USER,
			password: process.env.RABBITMQ_PASS,
		});
		channel = await connection.createChannel();
		console.log('✅Connected to RabbitMQ.');
	} catch (error) {
		console.error('Error connecting to RabbitMQ:', error);
		process.exit(1);
	}
};
