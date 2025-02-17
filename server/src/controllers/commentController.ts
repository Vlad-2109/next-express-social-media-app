import Comment from '../models/commentModel';
import asyncHandler from '../utils/catchAsync';

const createComment = asyncHandler(async (req: any, res, next) => {
  const { text } = req.body;
  const userId = req.user.id;

  const comment = await Comment.create({
    text,
    user: userId,
  });

  return res
    .status(201)
    .json({ status: 'success', message: 'Comment Created', data: { comment } });
});

export { createComment };
