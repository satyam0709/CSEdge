import express from 'express';
import { getContestsAndPOTD, bustContestCache } from '../controllers/contestController.js';
const contestRouter = express.Router();
contestRouter.get('/', getContestsAndPOTD);
contestRouter.post('/bust-cache', bustContestCache);
export default contestRouter;