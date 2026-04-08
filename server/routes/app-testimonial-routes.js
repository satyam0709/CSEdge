import express from 'express';
import { listTestimonials, submitTestimonial } from '../controllers/testimonialController.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

router.get('/', listTestimonials);
router.post('/', requireAuth(), submitTestimonial);

export default router;
