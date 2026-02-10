import express from 'express'
import { getUserDashboard } from "../controllers/userController.js";

import { 
    addUserRating, 
    getUserCourseProgress, 
    getUserData, 
    purchaseCourse, 
    updateUserCourseProgress, 
    userEnrolledCourses,
    getUserPurchases,
    verifyPurchase,
    addExternalProblem,
    listExternalProblems,
    toggleExternalProblem,
    deleteExternalProblem
} from '../controllers/userController.js'
import { checkPurchaseStatus, checkAllPendingPurchases } from '../controllers/webhooks.js'
import { requireAuth } from "@clerk/express";

const userRouter = express.Router()

// Apply auth middleware to all routes
userRouter.use(requireAuth());

// USER CORE
userRouter.get("/data", getUserData);
userRouter.get("/dashboard", getUserDashboard);

// COURSES
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.post("/get-course-progress", getUserCourseProgress);
userRouter.post("/add-rating", addUserRating);

// PAYMENTS
userRouter.post("/purchase", purchaseCourse);
userRouter.get("/purchases", getUserPurchases);
userRouter.post("/verify-purchase", verifyPurchase);
userRouter.get("/purchase-status/:purchaseId", checkPurchaseStatus);
userRouter.post("/check-pending-purchases", checkAllPendingPurchases);

// EXTERNAL PROBLEMS (User-tracked links)
userRouter.post("/external-problem", addExternalProblem);
userRouter.get("/external-problems", listExternalProblems);
userRouter.put("/external-problem/:id", toggleExternalProblem);
userRouter.delete("/external-problem/:id", deleteExternalProblem);


export default userRouter
