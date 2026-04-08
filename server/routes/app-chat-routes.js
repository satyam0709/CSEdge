import express from 'express';
import { requireAuth } from '@clerk/express';
import { lectureChat } from '../controllers/chatController.js';

const router = express.Router();

router.post('/lecture-assistant', requireAuth(), lectureChat);

export default router;
