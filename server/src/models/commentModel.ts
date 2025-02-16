import mongoose from 'mongoose';

export interface IComment extends Document {
  text: string;
  user: mongoose.Types.ObjectId;
  timestamps: boolean;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
