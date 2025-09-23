import axios from 'axios';
import TryCatch from '../config/TryCatch.js';
import { AuthRequest } from '../middlewares/isAuth.js';
import { ChatModel } from '../models/ChatModel.js';
import { MessageModel } from '../models/MessageModel.js';

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

export const getAllChats = TryCatch(async (req: AuthRequest, res) => {
	const userId = req.user?._id;

	if (!userId) {
		res.status(401).json({ message: 'User not found. Unauthorized Access.' });
		return;
	}

	const chats = await ChatModel.find({ users: userId }).sort({ updatedAt: -1 });

	const chatWithLatestMessages = await Promise.all(
		chats.map(async (chat) => {
			const otherUserId = chat.users.find((id) => id !== userId);
			const unseenCount = await MessageModel.countDocuments({
				chatId: chat._id,
				sender: { $ne: userId },
				seen: false,
			});

			try {
				const { data } = await axios.get(`${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`);

				return {
					user: data,
					chat: {
						...chat.toObject(),
						latestMessage: chat.latestMessage || null,
						unseenCount,
					},
				};
			} catch (error) {
				console.error('Error fetching user data:', error);
				return {
					user: { _id: otherUserId, name: 'Unknown User' },
					chat: { ...chat.toObject(), latestMessage: chat.latestMessage || null, unseenCount },
				};
			}
		})
	);

	res.status(200).json({ chats: chatWithLatestMessages });
});
