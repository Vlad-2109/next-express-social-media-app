import { Router } from 'express';
import { createPost, getAllPosts } from '../controllers/postController';
import isAuthenticated from '../middleware/isAuthenticated';
import upload from '../middleware/multer';

const router = Router();

router.get('/all', getAllPosts);
router.post('/create-post', isAuthenticated, upload.single('image'), createPost)

export default router;
