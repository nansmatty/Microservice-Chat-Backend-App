import TryCatch from '../config/TryCatch.js';
import { AuthRequest } from '../middlewares/isAuth.js';
import { ChatModel } from '../models/ChatModel.js';

export const createNewChat = TryCatch(async (req: AuthRequest, res) => {
	const userId = req.user!._id;

	const { recipientId } = req.body;

	if (!recipientId) {
		res.status(400).json({ message: 'Recipient ID is required.' });
		return;
	}

	const existingChat = await ChatModel.findOne({
		users: { $all: [userId, recipientId], $size: 2 },
	});

	if (existingChat) {
		res.status(200).json({ message: 'Chat already exists.', chatId: existingChat._id });
		return;
	}

	const newChat = await ChatModel.create({
		users: [userId, recipientId],
	});

	res.status(201).json({ message: 'No existing chat found. A new chat can be created.', chatId: newChat._id });
});
