import sharp from 'sharp';
import AppError from '../utils/appError';
import asyncHandler from '../utils/catchAsync';
import { cloudinary, uploadToCloudinary } from '../utils/cloudinary';
import Post from '../models/postModel';
import User from '../models/userModel';
import Comment from '../models/commentModel';

const createPost = asyncHandler(async (req: any, res, next) => {
  const { caption } = req.body;
  const image = req.file;
  const userId = req.user.id;

  if (!image) {
    return next(new AppError('Image is required for the post', 400));
  }

  // optimize our image
  const optimizedImageBuffer = await sharp(image.buffer)
    .resize({
      width: 800,
      height: 800,
      fit: 'inside',
    })
    .toFormat('jpeg', { quality: 80 })
    .toBuffer();

  const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

  const cloudResponse = await uploadToCloudinary(fileUri);

  let post = await Post.create({
    caption,
    image: {
      url: cloudResponse.secure_url,
      publicId: cloudResponse.public_id,
    },
    user: userId,
  });

  // add post to users posts
  const user = await User.findById(userId);
  if (user) {
    user.posts.push(post.id);
    await user.save({ validateBeforeSave: false });
  }

  post = await post.populate({
    path: 'user',
    select: 'username email bio profilePicture',
  });

  return res
    .status(201)
    .json({ status: 'success', message: 'Post Created', data: { post } });
});

const getAllPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate({
    path: 'user',
    select: 'username profilePicture bio'
  }).populate({
    path: 'comments',
    select: 'text user',
    populate: {
      path: 'user',
      select: 'username profilePicture'
    }
  }).sort({createdAt: -1})

  return res.status(200).json({ status: 'success', results: posts.length, data: { posts } });
})

const getUserPosts = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const posts = await Post.find({ user: userId }).populate({
    path: 'comments',
    select: 'text user',
    populate: {
      path: 'user',
      select: 'username profilePicture',
    },
  }).sort({ createdAt: -1 });
  
  return res.status(200).json({ status: 'success', results: posts.length, data: { posts } });
})

const saveOrUnsavePost = asyncHandler(async (req: any, res, next) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const isPostSaved = user.savedPosts.includes(postId);

  if (isPostSaved) {
    const user = await User.updateOne(
      { _id: userId },
      { $pull: { savedPosts: postId } },
    );

    return res.status(200).json({ status: 'success', message: 'Post unsaved successfully', data: { user } });
  } else {
    const user = await User.updateOne(
      { _id: userId },
      { $addToSet: { savedPosts: postId } },
    );

    return res.status(200).json({ status: 'success', message: 'Post saved successfullly', data: { user } });
  }
});

const deletePost = asyncHandler(async (req: any, res, next) => {
  const postId = req.params.postId;
  const userId = req.user.id;

  const post = await Post.findById(postId).populate('user');
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  if (post.user._id.toString() !== userId.toString()) {
    return next(new AppError('You are not authorized to delete this post', 403));
  }

  // remove the post from user posts
  await User.updateOne({ _id: userId }, { $pull: { posts: postId } });

  // delete this post from users save list
  await User.updateMany({ savedPosts: postId }, { $pull: { savedPosts: postId } });

  // remove the comments of this post
  await Comment.deleteMany({ post: postId });
  
  // remove image from cloudinary
  if (post.image.publicId) {
    await cloudinary.uploader.destroy(post.image.publicId);
  }

  // remove the post
  await Post.findByIdAndDelete(postId);

  return res.status(200).json({ status: 'success', message: 'Post deleted successfully' });
})

const likeOrDislikePost = asyncHandler(async (req: any, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });

    return res.status(200).json({ status: 'success', message: 'Post disliked successfully' });
  } else {
    await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });

    return res.status(200).json({ status: 'success', message: 'Post liked successfully' });
  }

})

const addComment = asyncHandler(async (req: any, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const { text } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  if (!text) {
    return next(new AppError('Comment text is required', 400));
  }

  const comment = await Comment.create({
    text,
    user: userId
  });

  post.comments.push(comment.id);
  await post.save({ validateBeforeSave: false });

  await comment.populate({ path: 'user', select: 'username profilePicture bio' });

  res.status(201).json({ status: 'success', message: 'Comment added successfully', data: { comment } });
})

export { createPost, getAllPosts, getUserPosts, saveOrUnsavePost, deletePost, likeOrDislikePost, addComment };
