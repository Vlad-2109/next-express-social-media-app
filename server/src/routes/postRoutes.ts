import { Router } from 'express';
import { createPost, getAllPosts, getUserPosts, saveOrUnsavePost } from '../controllers/postController';
import isAuthenticated from '../middleware/isAuthenticated';
import upload from '../middleware/multer';

const router = Router();

router.get('/all', getAllPosts);
router.get('/user-post/:id', getUserPosts);
router.post('/create-post', isAuthenticated, upload.single('image'), createPost);
router.post('/save-unsave-post/:postId', isAuthenticated, saveOrUnsavePost);

export default router;
