import Course from '../models/course.js'

export const getAllCourse = async(req,res)=>{
    try{
        const { search } = req.query;
        const filter = { isPublished: true };
        if (search) {
            // case insensitive substring match on title
            filter.courseTitle = { $regex: search, $options: 'i' };
        }
        const courses = await Course.find(filter).select([
            '-courseContent','-enrolledStudents'
        ]).populate({path : 'educator'})

        res.json({success: true , courses})
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}

// admin list potentially include unpublished
export const getAllCoursesAdmin = async(req,res)=>{
    try{
        const { search } = req.query;
        const filter = {};
        if (search) {
            filter.courseTitle = { $regex: search, $options: 'i' };
        }
        const courses = await Course.find(filter).populate({path : 'educator'});
        res.json({success:true, courses});
    } catch(error) {
        res.json({success:false, message:error.message});
    }
}

export const getCourseId = async(req,res)=>{
    const{id} = req.params;
    try{
        const courseData = await Course.findById(id).populate({path : 'educator'})
        
        if(!courseData){
             return res.json({success: false, message: 'Course not found'})
        }

        courseData.courseContent.forEach(chapter=>{
            chapter.chapterContent.forEach(lecture =>{
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl = "";
                }
            })
        })
        res.json({success: true , courseData})
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}


export const createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        const saved = await course.save();
        res.json({ success: true, course: saved });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Course.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.json({ success: false, message: 'Course not found' });
        res.json({ success: true, course: updated });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const removed = await Course.findByIdAndDelete(id);
        if (!removed) return res.json({ success: false, message: 'Course not found' });
        res.json({ success: true, message: 'Course deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const sampleCourses = [
    {
        courseTitle: "Full Stack Web Development",
        courseDescription: "Learn to build complete web applications from front-end to back-end using modern technologies.",
        courseThumbnail: "https://via.placeholder.com/300x200?text=Full+Stack+Web+Dev",
        coursePrice: 99.99,
        discount: 20,
        educator: "Educator One",
        courseContent: [
            {
                chapterTitle: "Introduction to Web Development",
                chapterContent: [
                    { lectureTitle: "What is Web Development?", lectureDuration: 10, lectureUrl: "https://example.com/lecture1", isPreviewFree: true },
                    { lectureTitle: "Setting up Development Environment", lectureDuration: 15, lectureUrl: "https://example.com/lecture2", isPreviewFree: true }
                ]
            },
            {
                chapterTitle: "Front-End Basics",
                chapterContent: [
                    { lectureTitle: "HTML Fundamentals", lectureDuration: 20, lectureUrl: "https://example.com/lecture3", isPreviewFree: true },
                    { lectureTitle: "CSS Styling", lectureDuration: 25, lectureUrl: "https://example.com/lecture4", isPreviewFree: false }
                ]
            }
        ],
        courseRatings: [
            { rating: 5, comment: "Excellent course!" },
            { rating: 4, comment: "Very informative." }
        ],
        enrolledStudents: [],
        isPublished: true
    },
    {
        courseTitle: "React.js Masterclass",
        courseDescription: "Master React.js and build dynamic user interfaces with modern React patterns.",
        courseThumbnail: "https://via.placeholder.com/300x200?text=React+Masterclass",
        coursePrice: 79.99,
        discount: 15,
        educator: "Educator Two",
        courseContent: [
            {
                chapterTitle: "React Fundamentals",
                chapterContent: [
                    { lectureTitle: "Introduction to React", lectureDuration: 12, lectureUrl: "https://example.com/lecture5", isPreviewFree: true },
                    { lectureTitle: "Components and Props", lectureDuration: 18, lectureUrl: "https://example.com/lecture6", isPreviewFree: true }
                ]
            }
        ],
        courseRatings: [
            { rating: 5, comment: "Great for beginners!" }
        ],
        enrolledStudents: [],
        isPublished: true
    },
    {
        courseTitle: "Node.js Backend Development",
        courseDescription: "Build scalable server-side applications with Node.js and Express.",
        courseThumbnail: "https://via.placeholder.com/300x200?text=Node.js+Backend",
        coursePrice: 89.99,
        discount: 10,
        educator: "Educator Three",
        courseContent: [
            {
                chapterTitle: "Node.js Basics",
                chapterContent: [
                    { lectureTitle: "What is Node.js?", lectureDuration: 8, lectureUrl: "https://example.com/lecture7", isPreviewFree: true },
                    { lectureTitle: "Express Framework", lectureDuration: 22, lectureUrl: "https://example.com/lecture8", isPreviewFree: false }
                ]
            }
        ],
        courseRatings: [
            { rating: 4, comment: "Solid content." }
        ],
        enrolledStudents: [],
        isPublished: true
    },
    {
        courseTitle: "MongoDB Database Design",
        courseDescription: "Learn MongoDB database design and management for modern applications.",
        courseThumbnail: "https://via.placeholder.com/300x200?text=MongoDB+Design",
        coursePrice: 69.99,
        discount: 25,
        educator: "Educator Four",
        courseContent: [
            {
                chapterTitle: "Database Fundamentals",
                chapterContent: [
                    { lectureTitle: "Introduction to MongoDB", lectureDuration: 14, lectureUrl: "https://example.com/lecture9", isPreviewFree: true },
                    { lectureTitle: "CRUD Operations", lectureDuration: 20, lectureUrl: "https://example.com/lecture10", isPreviewFree: true }
                ]
            }
        ],
        courseRatings: [
            { rating: 5, comment: "Very detailed." }
        ],
        enrolledStudents: [],
        isPublished: true
    }
];

export const seedCourses = async (req, res) => {
    try {
        await Course.deleteMany({});

        const seededCourses = await Course.insertMany(sampleCourses);

        res.json({ success: true, message: `${seededCourses.length} courses seeded successfully`, courses: seededCourses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};