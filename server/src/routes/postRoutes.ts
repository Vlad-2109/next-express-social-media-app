import { Router } from 'express';
import { addComment, createPost, deletePost, getAllPosts, getUserPosts, likeOrDislikePost, saveOrUnsavePost } from '../controllers/postController';
import isAuthenticated from '../middleware/isAuthenticated';
import upload from '../middleware/multer';

const router = Router();

router.get('/all', getAllPosts);
router.get('/user-post/:id', getUserPosts);
router.post('/create-post', isAuthenticated, upload.single('image'), createPost);
router.post('/save-unsave-post/:postId', isAuthenticated, saveOrUnsavePost);
router.post('/delete-post/:postId', isAuthenticated, deletePost);
router.post('/like-dislike/:postId', isAuthenticated, likeOrDislikePost);
router.post('/comment/:postId', isAuthenticated, addComment);

export default router;
