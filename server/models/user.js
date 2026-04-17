import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        _id: {
            type:String,
            required:true
        },
        name :{
            type : String,
            required : true
        },
        imageUrl : {
            type: String ,
            default: ""
        },
        email :{
            type : String ,
            default: ""
        },
        branch: {
            type: String,
            default: ""
        },
        year: {
            type: String,
            default: ""
        },
        college: {
            type: String,
            default: ""
        },
        enrolledCourses :[
            {
                type : mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
    },
    {
        timestamps : true
    }
);

const User = mongoose.model('User' , userSchema);
export default User