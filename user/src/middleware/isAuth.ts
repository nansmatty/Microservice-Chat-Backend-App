import { NextFunction, Request, Response } from 'express';
import { IUser } from '../model/UserModel.js';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
	user?: IUser | null;
}

export const isAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			res.status(401).json({ message: 'Please login first.' });
			return;
		}

		const token = authHeader.split(' ')[1];
		if (!token) {
			res.status(401).json({ message: 'Token not found.' });
			return;
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

		if (!decoded || !decoded.user) {
			res.status(401).json({ message: 'Invalid token.' });
			return;
		}

		req.user = decoded.user as IUser;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Unauthorized access.' });
	}
};
