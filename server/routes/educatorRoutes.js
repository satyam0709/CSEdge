import express from 'express';
import { requireAuth } from '@clerk/express';
import { updateRoleToEducator } from '../controllers/educatorController.js';

const router = express.Router();

router.get('/update-role', requireAuth(), updateRoleToEducator);

router.put('/update-role', requireAuth(), updateRoleToEducator);

export default router;