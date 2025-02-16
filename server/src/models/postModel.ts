import mongoose from 'mongoose';

export interface IPost extends Document {
  caption: string;
  image: {
    url: string;
    publicId: string;
  };
  user: mongoose.Types.ObjectId;
  likes: [mongoose.Types.ObjectId];
  timestamps: boolean;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    caption: {
      type: String,
      maxlength: [2200, 'Caption should be less then 2200 characters'],
      trim: true,
    },
    image: {
      url: { type: String, required: true },
      publicId: {
        type: String,
        required: true,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true },
);

postSchema.index({ user: 1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
