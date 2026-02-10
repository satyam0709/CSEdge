import express from 'express';
import { requireAuth } from '@clerk/express';
import protectEducator from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js';
import { updateRoleToEducator, addCourse, getEducatorCourse , educatorDashboardData, getEnrolledStudentData} from '../controllers/educatorController.js';

const educatorRouter = express.Router();

educatorRouter.post("/update-role", requireAuth(), updateRoleToEducator);
educatorRouter.post("/add-course", requireAuth(), protectEducator, upload.single("image"), addCourse);
educatorRouter.get("/courses", requireAuth(), protectEducator, getEducatorCourse);
educatorRouter.get("/dashboard", requireAuth(), protectEducator, educatorDashboardData);
educatorRouter.get("/enrolled-students", requireAuth(), protectEducator, getEnrolledStudentData);


export default educatorRouter;
