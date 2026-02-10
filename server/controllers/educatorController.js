import { clerkClient } from '@clerk/express';
import Course from '../models/course.js'
import { v2 as cloudinary } from 'cloudinary'
import { Purchase } from '../models/Purchase.js';
import User from '../models/user.js';
import ExternalProblem from '../models/ExternalProblem.js';

export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth()?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - User not authenticated'
            });
        }

        const user = await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        });

        return res.status(200).json({
            success: true,
            message: 'You can publish a course now',
            data: {
                userId: user.id,
                role: 'educator',
                updatedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error updating user role:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update user role'
        });
    }
};

export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body
        const imageFile = req.file
        const educatorId = req.auth().userId

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' })
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({ success: true, message: 'Course Added' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getEducatorCourse = async (req, res) => {
    try {
        const educator = req.auth().userId
        const courses = await Course.find({ educator })
        res.json({ success: true, courses })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth().userId;
        const courses = await Course.find({ educator });
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed',
        });

        const totalEarnings = purchases.reduce((sum, purchase) =>
            sum + purchase.amount, 0);

        // Collect Enrolled Student Data safely
        const enrolledStudentData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            });
        }

        res.json({
            success: true, dashboardData: {
                totalEarnings, enrolledStudentData, totalCourses
            }
        })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getEnrolledStudentData = async (req, res) => {
    try {
        const educator = req.auth().userId;
        const courses = await Course.find({ educator });
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed',
        })
        .populate('userId', 'name imageUrl')
        .populate('courseId', 'courseTitle');

        // Filter out broken data (e.g., if a user or course was deleted)
        const enrolledStudents = purchases
            .filter(purchase => purchase.userId && purchase.courseId)
            .map(purchase => ({
                student: purchase.userId,
                courseTitle: purchase.courseId.courseTitle,
                purchaseDate: purchase.createdAt
            }));

        res.json({ success: true, enrolledStudents })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getExternalProblemsForEducator = async (req, res) => {
    try {
        // Aggregate recent external problems across users for educator/admin view
        // For now, return recent 100 entries and counts by type/source
        const recent = await ExternalProblem.find({}).sort({ createdAt: -1 }).limit(100);

        // Populate basic user info where possible
        const userIds = [...new Set(recent.map(r => r.userId))];
        const users = await User.find({ _id: { $in: userIds } }, 'name imageUrl');
        const userMap = {};
        users.forEach(u => userMap[u._id] = u);

        const items = recent.map(r => ({
            _id: r._id,
            url: r.url,
            title: r.title,
            source: r.source,
            type: r.type,
            solved: r.solved,
            createdAt: r.createdAt,
            user: userMap[r.userId] || null
        }));

        const countsByType = {};
        const countsBySource = {};
        recent.forEach(r => {
            countsByType[r.type] = (countsByType[r.type] || 0) + 1;
            if (r.source) countsBySource[r.source] = (countsBySource[r.source] || 0) + 1;
        });

        res.json({ success: true, items, countsByType, countsBySource });
    } catch (error) {
        console.error('getExternalProblemsForEducator error', error);
        res.json({ success: false, message: error.message });
    }
};