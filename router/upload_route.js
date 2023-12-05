// routes.js
import express from 'express';
import s3Uploader from '../controllers/file_uploader.js'; 
import multer from 'multer';

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  cb(null, true);
};
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
    fileFilter,
});

const file_uploader = express();
const { uploadFiles } = s3Uploader();

file_uploader.post('/upload', upload.array('files', 10), uploadFiles); // Add upload.array middleware

export default file_uploader;
