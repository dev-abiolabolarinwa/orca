import { Response, Request, NextFunction } from 'express';
import multer from 'multer';

import { PostLimits } from '../constants';

const storage = multer.memoryStorage();
const multerUpload = multer({
  storage,
  limits: {
    // 50MB is the limit
    fileSize: 50000000,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes('image') && !file.mimetype.includes('video')) {
      return cb(new Error('Please upload an image or video only.'));
    }
    cb(null, true);
  },
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'media', maxCount: PostLimits.MAX_NUMBER_FILES },
]);

export function handleFiles(req: Request, res: Response, next: NextFunction) {
  multerUpload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).send(`Error occurred when uploading: ${err.code} in field: ${err.field}`);
    } else if (err) {
      return res.status(400).send(`An unknown error occurred when uploading ${err.message ? err.message : ''}`);
    }

    next();
  });
}
