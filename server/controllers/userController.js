import { User } from "@clerk/express"

export const getUserData = async(requestAnimationFrame,res)=>{
    try{
        const userId = req.auth.userId
        const user = await User.findById(userId)

        if(!user){
            return res.json({success: false , message: 'User Not found'})
        }
        req.json({success: true , user})
    }
    catch(error){
        res.json({success: false , message: error.message})
    }
}


export const usrEnrolledCourses = async(req,res)=>{
    try{
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate('enrolledCourses')

        res.json({success: true, enrolledCourses: userData.enrolledCourses})
    }   
    catch(error){
        res.json({success: false , message: error.message})
    }
}