import Course from "../models/course.js"
import { CourseProgress } from "../models/CourseProgress.js"
import { Purchase } from "../models/Purchase.js"
import User from "../models/user.js"
import Stripe from "stripe"
import { clerkClient } from '@clerk/express'

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getUserData = async(req, res) => {
    try {
        const userId = req.auth().userId;

        // First try to find user in our database
        let user = await User.findById(userId);

        // If user doesn't exist in our DB, create them from Clerk data
        if (!user) {
            try {
                const clerkUser = await clerkClient.users.getUser(userId);
                user = await User.create({
                    _id: userId,
                    email: clerkUser.email_addresses?.[0]?.email_address || "",
                    name: `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`.trim() || "User",
                    imageUrl: clerkUser.image_url || ""
                });
                console.log("User created in DB:", user._id);
            } catch (clerkError) {
                console.error("Error fetching from Clerk:", clerkError);
                return res.json({ success: false, message: 'User Not found' });
            }
        }

        res.json({ success: true, user });
    }
    catch (error) {
        console.error("Get user data error:", error);
        res.json({ success: false, message: error.message });
    }
}

export const userEnrolledCourses = async(req, res) => {
    try {
        const userId = req.auth().userId;
        const userData = await User.findById(userId).populate('enrolledCourses');

        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Filter out any null courses (in case courses were deleted but still referenced)
        const enrolledCourses = userData.enrolledCourses.filter(course => course !== null);

        res.json({ success: true, enrolledCourses });
    }
    catch (error) {
        console.error("Get enrolled courses error:", error);
        res.json({ success: false, message: error.message });
    }
}

export const purchaseCourse = async(req, res) => {
    try {
        const { courseId } = req.body;
        const { origin } = req.headers;
        const userId = req.auth().userId;

        console.log("Purchase initiated - User:", userId, "Course:", courseId);

        // Validate user and course
        let userData = await User.findById(userId);

        // If user doesn't exist in our DB, create them from Clerk data
        if (!userData) {
            try {
                const clerkUser = await clerkClient.users.getUser(userId);
                userData = await User.create({
                    _id: userId,
                    email: clerkUser.email_addresses?.[0]?.email_address || "",
                    name: `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`.trim() || "User",
                    imageUrl: clerkUser.image_url || ""
                });
                console.log("User created in DB during purchase:", userData._id);
            } catch (clerkError) {
                console.error("Error creating user during purchase:", clerkError);
                return res.json({ success: false, message: 'User Not found' });
            }
        }

        const courseData = await Course.findById(courseId);

        if (!courseData) {
            return res.json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if already enrolled
        if (userData.enrolledCourses.includes(courseId)) {
            return res.json({ 
                success: false, 
                message: 'Already enrolled in this course' 
            });
        }

        // Calculate final price
        const finalAmount = (courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100)).toFixed(2);

        // Create purchase record
        const purchaseData = {
            courseId: courseData._id,
            userId: userId,
            amount: finalAmount,
            status: 'pending'
        }

        const newPurchase = await Purchase.create(purchaseData);
        console.log('New purchase created:', newPurchase._id);

        // Create Stripe checkout session
        const currency = process.env.CURRENCY?.toLowerCase() || 'usd';

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle,
                    description: courseData.courseDescription || `Enrollment for ${courseData.courseTitle}`,
                    images: courseData.courseImage ? [courseData.courseImage] : []
                },
                unit_amount: Math.round(parseFloat(finalAmount) * 100) // Convert to cents
            },
            quantity: 1
        }]

        const sessionConfig = {
            success_url: `${origin}/loading/my-enrollments?session_id={CHECKOUT_SESSION_ID}&purchase_id=${newPurchase._id}`,
            cancel_url: `${origin}/course/${courseId}?canceled=true`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString(),
                userId: userId,
                courseId: courseId
            },
            client_reference_id: userId,
            expires_at: Math.floor(Date.now() / 1000) + (30 * 60) // Expires in 30 minutes
        };

        // Only add customer_email if we have a valid email
        if (userData.email && userData.email.trim() !== '') {
            sessionConfig.customer_email = userData.email;
        }

        const session = await stripeInstance.checkout.sessions.create(sessionConfig);

        // Update purchase with session ID
        newPurchase.stripeSessionId = session.id;
        await newPurchase.save();

        console.log('Stripe session created:', session.id);
        console.log('Session metadata:', session.metadata);

        res.json({ 
            success: true, 
            session_url: session.url,
            sessionId: session.id,
            purchaseId: newPurchase._id 
        });

    } catch (error) {
        console.error('Purchase course error:', error);
        res.json({ success: false, message: error.message });
    }
}

export const updateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const { courseId, lectureId } = req.body;

        if (!courseId || !lectureId) {
            return res.json({ 
                success: false, 
                message: 'Course ID and Lecture ID required' 
            });
        }

        // Check if user is enrolled in the course
        const user = await User.findById(userId);
        if (!user.enrolledCourses.includes(courseId)) {
            return res.json({ 
                success: false, 
                message: 'Not enrolled in this course' 
            });
        }

        const progressData = await CourseProgress.findOne({ userId, courseId });

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ 
                    success: true, 
                    message: 'Lecture Already Completed' 
                });
            }
            progressData.lectureCompleted.push(lectureId);
            
            // Check if all lectures are completed
            const course = await Course.findById(courseId);
            if (course && course.courseContent) {
                const allLecturesCompleted = course.courseContent.every(chapter =>
                    chapter.chapterContent.every(lecture =>
                        progressData.lectureCompleted.includes(lecture.lectureId.toString())
                    )
                );
                progressData.completed = allLecturesCompleted;
            }
            
            await progressData.save();
        } else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId],
                completed: false
            });
        }

        res.json({ success: true, message: 'Progress Updated' });

    } catch (error) {
        console.error("Update progress error:", error);
        res.json({ success: false, message: error.message });
    }
}

export const getUserCourseProgress = async(req, res) => {
    try {
        const userId = req.auth().userId;
        const { courseId } = req.body;

        if (!courseId) {
            return res.json({ 
                success: false, 
                message: 'Course ID required' 
            });
        }

        const progressData = await CourseProgress.findOne({ userId, courseId });
        res.json({ success: true, progressData });
    } 
    catch (error) {
        console.error("Get progress error:", error);
        res.json({ success: false, message: error.message });
    }
}

export const addUserRating = async(req, res) => {
    try {
        const userId = req.auth().userId;
        const { courseId, rating, review } = req.body;

        // Validate input
        if (!courseId || !rating || rating < 1 || rating > 5) {
            return res.json({ 
                success: false, 
                message: 'Invalid rating details' 
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.json({ 
                success: false, 
                message: 'Course not found' 
            });
        }

        const user = await User.findById(userId);
        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ 
                success: false, 
                message: 'User has not purchased this course' 
            });
        }

        // Check if user already rated
        const existingRatingIndex = course.courseRatings.findIndex(r => 
            r.userId === userId || r.userId.toString() === userId
        );

        if (existingRatingIndex > -1) {
            // Update existing rating
            course.courseRatings[existingRatingIndex].rating = rating;
            if (review) {
                course.courseRatings[existingRatingIndex].review = review;
            }
            course.courseRatings[existingRatingIndex].updatedAt = Date.now();
        } else {
            // Add new rating
            course.courseRatings.push({
                userId,
                rating,
                review: review || "",
                createdAt: Date.now()
            });
        }

        await course.save();
        return res.json({ success: true, message: 'Rating added successfully' });

    } catch (error) {
        console.error("Add rating error:", error);
        return res.json({ success: false, message: error.message });
    }
}

// Get user's purchase history
export const getUserPurchases = async(req, res) => {
    try {
        const userId = req.auth().userId;
        
        const purchases = await Purchase.find({ userId })
            .populate('courseId')
            .sort({ createdAt: -1 });

        res.json({ success: true, purchases });
    } catch (error) {
        console.error("Get purchases error:", error);
        res.json({ success: false, message: error.message });
    }
}

// Verify purchase completion (for frontend to check status)
export const verifyPurchase = async(req, res) => {
    try {
        const userId = req.auth().userId;
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.json({
                success: false,
                message: 'Session ID required'
            });
        }

        // Retrieve session from Stripe
        const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const { purchaseId } = session.metadata;

            if (purchaseId) {
                const purchase = await Purchase.findById(purchaseId);

                if (purchase && purchase.userId === userId) {
                    // If purchase is still pending, update it (fallback for webhook failure)
                    if (purchase.status === 'pending') {
                        console.log("Updating purchase status via verifyPurchase:", purchaseId);

                        // Find user and course
                        const user = await User.findById(purchase.userId);
                        const course = await Course.findById(purchase.courseId);

                        if (user && course) {
                            // Update course enrolled students
                            if (!course.enrolledStudents.includes(user._id)) {
                                course.enrolledStudents.push(user._id);
                                await course.save();
                                console.log("✅ Added user to course enrolledStudents via verifyPurchase");
                            }

                            // Update user enrolled courses
                            if (!user.enrolledCourses.includes(course._id)) {
                                user.enrolledCourses.push(course._id);
                                await user.save();
                                console.log("✅ Added course to user enrolledCourses via verifyPurchase");
                            }

                            // Update purchase status
                            purchase.status = "completed";
                            purchase.stripeSessionId = session.id;
                            purchase.paymentIntentId = session.payment_intent;
                            await purchase.save();

                            console.log("🎉 Purchase completed via verifyPurchase:", purchaseId);
                        }
                    }

                    return res.json({
                        success: true,
                        status: purchase.status,
                        message: 'Purchase verified'
                    });
                }
            }
        }

        res.json({
            success: false,
            message: 'Payment not completed'
        });

    } catch (error) {
        console.error("Verify purchase error:", error);
        res.json({ success: false, message: error.message });
    }
}
