import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
	users: string[];
	latestMessage: {
		text: string;
		sender: string;
	};
	createdAt: Date;
	updatedAt: Date;
}

const schema: Schema<IChat> = new Schema(
	{
		users: [{ type: String, required: true }],
		latestMessage: {
			text: { type: String, required: true },
			sender: { type: String, required: true },
		},
	},
	{
		timestamps: true,
	}
);

export const ChatModel = mongoose.model<IChat>('Chat', schema);
