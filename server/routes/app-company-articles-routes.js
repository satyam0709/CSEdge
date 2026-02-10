import express from 'express';
import { requireAuth } from '@clerk/express';
import protectAdmin from '../middlewares/protectAdmin.js';
import { createArticle, listArticles, deleteArticle } from '../controllers/companyArticleController.js';

const router = express.Router();

// Public: list articles for a company
router.get('/:companyId', listArticles);

// Admin routes: require auth + admin/educator
router.post('/', requireAuth(), protectAdmin, createArticle);
router.delete('/:id', requireAuth(), protectAdmin, deleteArticle);

export default router;
