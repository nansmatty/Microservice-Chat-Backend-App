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

export const sendMessage = TryCatch(async (req: AuthRequest, res) => {
	const senderId = req.user?._id;
	const { chatId, text } = req.body;
	const imageFile = req.file;

	if (!senderId) {
		res.status(401).json({ message: 'User not found. Unauthorized Access.' });
		return;
	}

	if (!chatId) {
		res.status(400).json({ message: 'Chat ID is required.' });
		return;
	}

	if (!text && !imageFile) {
		res.status(400).json({ message: 'Either text or image is required to send a message.' });
		return;
	}

	const chat = await ChatModel.findById(chatId);
	if (!chat) {
		res.status(404).json({ message: 'Chat not found.' });
		return;
	}

	const isUserInChat = chat.users.some((userId) => userId.toString() === senderId.toString());

	if (!isUserInChat) {
		res.status(403).json({ message: 'You are not a participant of this chat.' });
		return;
	}

	const otherUserId = chat.users.find((id) => id.toString() !== senderId.toString());

	if (!otherUserId) {
		res.status(401).json({ message: 'Cannot determine the recipient of the message.' });
		return;
	}

	// Socket Setup

	let messageData: any = { chatId, sender: senderId, messageType: 'text' as const, seen: false, seenAt: undefined };

	if (imageFile) {
		messageData.image = {
			url: imageFile.path,
			publicId: imageFile.filename,
		};
		messageData.messageType = 'image';
		messageData.text = text || '';
	} else {
		messageData.text = text;
		messageData.messageType = 'text';
	}

	const message = await MessageModel.create(messageData);
	const latestMessage = imageFile ? 'Image' : text;

	await ChatModel.findByIdAndUpdate(chatId, { latestMessage: { text: latestMessage, sender: senderId }, updatedAt: new Date() }, { new: true });

	//Emit socket event to recipient if connected

	res.status(201).json({ message: 'Message sent successfully.', data: message });
});
