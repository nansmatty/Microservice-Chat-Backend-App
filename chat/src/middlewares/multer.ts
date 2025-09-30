import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'chat_app_images',
		allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
		transformation: [{ width: 800, height: 600, crop: 'limit' }, { quality: 'auto' }],
	} as any,
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		if (!file.mimetype.startsWith('image/')) {
			return cb(new Error('Only image files are allowed!'));
		} else {
			cb(null, true);
		}
	},
}); // 5MB limit

export default upload;
