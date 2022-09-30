import { Response } from 'express';
import { PostLimits } from '../constants';

// Check the file size
export function checkFileSize(file, res: Response) {
  if (file.mimetype.includes('image')) {
    if (file.size > PostLimits.MAX_IMAGE_SIZE) {
      return res.status(400).send(`The image size should be less than ${PostLimits.MAX_IMAGE_SIZE / 1000000}MB`);
    }
  } else if (file.mimetype.includes('video')) {
    if (file.size > PostLimits.MAX_VIDEO_SIZE) {
      return res.status(400).send(`The video size should be less than ${PostLimits.MAX_VIDEO_SIZE / 1000000}MB`);
    }
  }
}
