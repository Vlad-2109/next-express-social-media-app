import { Router } from 'express';
import { createPost } from '../controllers/postController';
import isAuthenticated from '../middleware/isAuthenticated';
import upload from '../middleware/multer';

const router = Router();

router.post('/create-post', isAuthenticated, upload.single('image'), createPost)

export default router;
