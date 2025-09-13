import ampqlib from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const startSentOTPConsumer = async () => {
	try {
		const connection = await ampqlib.connect({
			protocol: 'amqp',
			hostname: process.env.RABBITMQ_HOST,
			port: parseInt(process.env.RABBITMQ_PORT!),
			username: process.env.RABBITMQ_USER,
			password: process.env.RABBITMQ_PASS,
		});
		const channel = await connection.createChannel();
		const queueName = 'send_otp_email';

		await channel.assertQueue(queueName, { durable: true });
		console.log('✅Connected to mail service rabbitMQ consumer.');

		channel.consume(
			queueName,
			async (msg) => {
				if (msg) {
					try {
						const { to, subject, body } = JSON.parse(msg.content.toString());

						// Create a transporter object using SMTP transport
						const transporter = nodemailer.createTransport({
							host: 'smtp.gmail.com', // Replace with your SMTP server
							port: 465, // Replace with your SMTP port
							auth: {
								user: process.env.EMAIL_USER, // Replace with your SMTP username
								pass: process.env.EMAIL_PASS, // Replace with your SMTP password
							},
						});

						// Send mail with defined transport object
						await transporter.sendMail({
							from: 'Chat App',
							to,
							subject,
							text: body,
						});

						console.log(`✅OTP email sent to ${to}`);
						channel.ack(msg);
					} catch (error) {
						console.error('‼️Error processing message:', error);
					}
				}
			},
			{ noAck: false }
		);
	} catch (error) {
		console.error('‼️Error to start rabbitMQ consumer:', error);
		process.exit(1);
	}
};
