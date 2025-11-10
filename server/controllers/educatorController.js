import { clerkClient } from '@clerk/express';
import Course from '../models/course'
import {v2 as cloudinary} from 'cloudinary'

export const updateRoleToEducator = async (req, res) => {
    try {
        // Get userId from Clerk auth
        const userId = req.auth?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - User not authenticated'
            });
        }

        // Update user metadata in Clerk
        const user = await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        });

        // Send success response
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

export const addCourse = async(req,res)=>{
    try{
        const{courseData} = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId

        if(!imageFile){
            return res.json({success:false , message: 'Thumbnail Not Attached'})
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload =  cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({success: true , message: 'Course Added'})

    } catch(error){
        res.json({success: false , message: error.message})
    }
}