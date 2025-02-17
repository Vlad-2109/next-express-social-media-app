import { Router } from 'express';
import { createComment } from '../controllers/commentController';
import isAuthenticated from '../middleware/isAuthenticated';

const router = Router();

router.post('/create-comment', isAuthenticated, createComment)

export default router;
