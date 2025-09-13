import { publishToQueue } from '../config/rabbitmq.js';
import { redis } from '../config/redis.js';
import TryCatch from '../config/TryCatch.js';

export const loginUser = TryCatch(async (req, res) => {
	const { email } = req.body;
	// Logic to authenticate user
	const rateLimitKey = `otp:ratelimit:${email}`;
	const rateLimit = await redis.get(rateLimitKey);

	if (rateLimit) {
		res.status(429).json({ message: 'Too many requests. Please wait before requesting new OTP.' });
		return;
	}

	const otp = Math.floor(100000 + Math.random() * 900000).toString();

	const otpKey = `otp:${email}`;
	await redis.set(otpKey, otp, 'EX', 300);

	await redis.set(rateLimitKey, '1', 'EX', 60); // Set rate limit for 1 minute

	const message = {
		to: email,
		subject: 'Your OTP Code',
		body: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
	};

	await publishToQueue('send_otp_email', message);

	res.status(200).json({ message: 'OTP sent to email' });
});
