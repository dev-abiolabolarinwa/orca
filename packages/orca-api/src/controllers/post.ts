import { Request, Response } from 'express';
import { AuthUser, ErrorCodes, ErrorMessages, UserRole } from '../constants';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import {
  getPostsByChannelId,
  getPostsByAuthorId,
  getPostById,
  createPost,
  deletePost,
  getFollowedPosts,
  postById,
  updatePost,
  pinPost,
} from '../db';

const PostController = {
  postsByFollowing: async (req: Request, res: Response): Promise<any> => {
    const authUser = req.user as AuthUser;
    const { offset, limit } = req.query;
    const posts = await getFollowedPosts(authUser?._id, +offset, +limit);
    return res.send(posts);
  },
  postsByChannelId: async (req: Request, res: Response): Promise<any> => {
    const { channelId } = req.params;
    const { offset, limit } = req.query;
    const posts = await getPostsByChannelId(channelId, +offset, +limit);
    return res.send(posts);
  },
  postsByAuthorId: async (req: Request, res: Response): Promise<any> => {
    const { authorId } = req.params;
    const { offset, limit } = req.query;
    const posts = await getPostsByAuthorId(authorId, +offset, +limit);
    return res.send(posts);
  },
  postById: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const post = await getPostById(id);
    return res.send(post);
  },
  create: async (req: Request, res: Response): Promise<any> => {
    const authUser = req.user as AuthUser;
    const { title, channelId } = req.body;
    //@ts-ignore
    const files = req.files.media;

    if (!title && !files) {
      return res.status(400).send('Post title or image is required.');
    }

    const mediaReady = [];
    let imageUrl: string;
    let imagePublicId: string;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadFile = await uploadToCloudinary(file, 'post');

        if (!uploadFile.secure_url) {
          return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
        }

        mediaReady.push({
          url: uploadFile.secure_url,
          publicId: uploadFile.public_id,
          type: file.mimetype.split('/')[0],
        });
      }
    }

    const newPost: any = await createPost(title, mediaReady, imageUrl, imagePublicId, channelId, authUser._id);
    return res.send(newPost);
  },
  update: async (req: Request, res: Response): Promise<any> => {
    const authUser = req.user as AuthUser;
    const { postId, title, mediaToDeletePublicId, channelId } = req.body;
    //@ts-ignore
    const files = req.files.media;
    const parsedMediaToDelete = JSON.parse(mediaToDeletePublicId);

    // Super Admins can update another user's post.
    if (authUser.role !== UserRole.SuperAdmin) {
      // Check if the post author is updating the post.
      const post: any = await postById(postId);
      if (post.author.toString() !== authUser._id.toString()) {
        return res.status(ErrorCodes.Bad_Request).send('Unauthorized');
      }
    }

    if (parsedMediaToDelete) {
      // Deleted the image selected
      for (const publicId of parsedMediaToDelete) {
        const deletedFile = await deleteFromCloudinary(publicId);
        if (deletedFile.result !== 'ok') {
          return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
        }
      }
    }

    const mediaReady = [];
    // Upload the new images if exist
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadFile = await uploadToCloudinary(file, 'post');

        if (!uploadFile.secure_url) {
          return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
        }

        mediaReady.push({
          url: uploadFile.secure_url,
          publicId: uploadFile.public_id,
          type: file.mimetype.split('/')[0],
        });
      }
    }

    const updatedPost = await updatePost(postId, title, mediaReady, parsedMediaToDelete, channelId);
    return res.send(updatedPost);
  },
  delete: async (req: Request, res: Response): Promise<any> => {
    const { id, imagePublicId, media } = req.body;
    const authUser = req.user as AuthUser;

    // Super Admins can delete another user's post.
    if (authUser.role !== UserRole.SuperAdmin) {
      // Check if the post author is removing the post.
      const post: any = await postById(id);
      if (post.author.toString() !== authUser._id.toString()) {
        return res.status(ErrorCodes.Bad_Request).send(ErrorMessages.Generic);
      }
    }

    if (media) {
      for (const file of media) {
        const deleteFile = await deleteFromCloudinary(file.publicId);
        if (deleteFile.result !== 'ok') {
          return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
        }
      }
    }

    if (imagePublicId) {
      const deleteImage = await deleteFromCloudinary(imagePublicId);
      if (deleteImage.result !== 'ok') {
        return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
      }
    }

    const deletedPost = await deletePost(id);
    return res.send(deletedPost);
  },
  pin: async (req: Request, res: Response): Promise<any> => {
    const { id, pinned } = req.body;
    const updatedPost = await pinPost(id, pinned);
    return res.send(updatedPost);
  },
};

export default PostController;
