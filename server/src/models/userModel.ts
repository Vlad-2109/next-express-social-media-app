import mongoose, { Document } from 'mongoose';
import validator from 'validator';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  profilePicture?: string;
  bio: string;
  following: mongoose.Types.ObjectId;
  posts: mongoose.Types.ObjectId;
  savedPosts: mongoose.Types.ObjectId;
  isVerified: boolean;
  otp: string | null;
  otpExpires: Date | null;
  resetPasswordOTP: string | null;
  resetPasswordOTPExpires: Date | null;
  timestamps: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Please add username'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (this: IUser, el: string) {
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 150,
      default: '',
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    posts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    savedPosts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    resetPasswordOTP: {
      type: String,
      default: null,
    },
    resetPasswordOTPExpires: {
      type: Date,
      default: null,
    }
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
