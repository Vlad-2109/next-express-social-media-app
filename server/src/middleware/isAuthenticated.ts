import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import asyncHandler from '../utils/catchAsync';
import AppError from '../utils/appError';
import User from '../models/userModel';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const isAuthenticated = asyncHandler(async (req: any, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  const decoded: any = jwt.verify(token, JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exist.', 401),
    );
  }

  req.user = currentUser;
  next();
});

export default isAuthenticated;