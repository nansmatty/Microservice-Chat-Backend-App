import jwt from 'jsonwebtoken';

export const generateToken = (user: any) => {
	const token = jwt.sign({ user }, process.env.JWT_SECRET!, {
		expiresIn: '7d',
	});
	return token;
};
