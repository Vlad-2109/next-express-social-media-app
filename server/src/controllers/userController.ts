import User from '../models/userModel';
import AppError from '../utils/appError';
import asyncHandler from '../utils/catchAsync';
import { uploadToCloudinary } from '../utils/cloudinary';
import getDataUri from '../utils/dataUri';

const getProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .select(
      '-password -otp -otpExpires -resetPasswordOTP -resetPasswordOTPExpires -passwordConfirm',
    )
    .populate({
      path: 'posts',
      options: { sort: { createdAt: -1 } },
    })
    .populate({
      path: 'savedPosts',
      options: { sort: { createdAt: -1 } },
    });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({ status: 'success', data: { user } });
});

const editProfile = asyncHandler(async (req: any, res, next) => {
  const userId = req.user.id;

  const { bio } = req.body;
  const profilePicture = req.file;

  let cloudResponse;

  if (profilePicture) {
    const fileUri = getDataUri(profilePicture);
    cloudResponse = await uploadToCloudinary(fileUri);
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (bio) user.bio = bio;
  if (profilePicture) user.profilePicture = cloudResponse?.secure_url;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json({ status: 'success', message: 'Profile Updated', data: { user } });
});

export { getProfile, editProfile };
