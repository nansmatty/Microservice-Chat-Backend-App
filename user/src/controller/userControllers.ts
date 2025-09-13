import { generateToken } from '../config/generateToken.js';
import { publishToQueue } from '../config/rabbitmq.js';
import { redis } from '../config/redis.js';
import TryCatch from '../config/TryCatch.js';
import { UserModel } from '../model/UserModel.js';

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

export const verifyOTP = TryCatch(async (req, res) => {
	const { email, otp: enteredOTP } = req.body;

	if (!email || !enteredOTP) {
		return res.status(400).json({ message: 'Email and OTP are required' });
	}

	const otpKey = `otp:${email}`;
	const storedOtp = await redis.get(otpKey);
	if (!storedOtp || storedOtp !== enteredOTP) {
		res.status(400).json({ message: 'Invalid or expired OTP' });
		return;
	}

	await redis.del(otpKey);

	let user = await UserModel.findOne({ email });

	if (!user) {
		const name = email.split('@')[0];
		user = await UserModel.create({ name, email });
	}

	const token = generateToken(user);

	res.status(200).json({ message: 'User verified successfully', user, token });
});
