import { Router } from 'express';
import { createPost, getAllPosts, getUserPosts } from '../controllers/postController';
import isAuthenticated from '../middleware/isAuthenticated';
import upload from '../middleware/multer';

const router = Router();

router.get('/all', getAllPosts);
router.get('/user-post/:id', getUserPosts);
router.post('/create-post', isAuthenticated, upload.single('image'), createPost)

export default router;
