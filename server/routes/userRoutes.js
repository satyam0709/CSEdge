import express from 'express'
import { 
    addUserRating, 
    getUserCourseProgress, 
    getUserData, 
    purchaseCourse, 
    updateUserCourseProgress, 
    userEnrolledCourses,
    getUserPurchases,
    verifyPurchase
} from '../controllers/userController.js'
import { checkPurchaseStatus, checkAllPendingPurchases } from '../controllers/webhooks.js'
import { requireAuth } from "@clerk/express";

const userRouter = express.Router()

// Apply auth middleware to all routes
userRouter.use(requireAuth());

// User data routes
userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrolledCourses)

// Purchase routes
userRouter.post('/purchase', purchaseCourse)
userRouter.get('/purchases', getUserPurchases)
userRouter.post('/verify-purchase', verifyPurchase)
userRouter.get('/purchase-status/:purchaseId', checkPurchaseStatus)
userRouter.post('/check-pending-purchases', checkAllPendingPurchases)

// Course progress routes
userRouter.post('/update-course-progress', updateUserCourseProgress)
userRouter.post('/get-course-progress', getUserCourseProgress)

// Rating route
userRouter.post('/add-rating', addUserRating)

export default userRouter
