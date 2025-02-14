import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import User, { IUser } from '../models/userModel';
import AppError from '../utils/appError';
import asyncHandler from '../utils/catchAsync';
import generateOtp from '../utils/generateOtp';
import sendEmail from '../utils/email';

dotenv.config();

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN: any = process.env.JWT_EXPIRES_IN || '1d';
const JWT_COOKIE_EXPIRES_IN: any = process.env.JWT_COOKIE_EXPIRES_IN || 10;
const NODE_ENV = process.env.NODE_ENV || '';

const loadTemplate = (templateName: string, replacements: any) => {
  const templatePath = path.join(__dirname, '../emailTemplate', templateName);
  const source = fs.readFileSync(templatePath, 'utf-8');
  const template = handlebars.compile(source);
  return template(replacements);
}

const signToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const createSendToken = (user: any, statusCode: number, res: Response | any, message: string) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 100),
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'none' : 'Lax',
  };

  res.cookie('token', token, cookieOptions);
  user.password = undefined;
  user.otp = undefined;
  res.status(statusCode).json({status: 'success', message, token, data: { user }})
}

const signup = asyncHandler(async (req, res, next) => {
  const { email, password, passwordConfirm, username } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError('Email already registerd', 400));
  }
  const otp = generateOtp();
  const otpExpires = Date.now() + 24 * 60 * 60 * 100;
  const newUser = await User.create({
    username,
    email,
    password,
    passwordConfirm,
    otp,
    otpExpires,
  });

  const htmlTemplate = loadTemplate('otpTemplate.hbs', {
    title: 'Otp Verification',
    username: newUser.username,
    otp,
    message: 'Your one-time password (OTP) for account verification is : '
  });

  try {
    await sendEmail({
      email: newUser.email,
      subject: 'OTP for Email Verification',
      html: htmlTemplate,
    })

    createSendToken(newUser, 200, res, 'Registration Successful. Check your email for otp verification');
  } catch (error) {
    await User.findByIdAndDelete(newUser.id);
    return next(new AppError('There is an error creating the account. Please try again later!', 500))
  }
});

export { signup };
