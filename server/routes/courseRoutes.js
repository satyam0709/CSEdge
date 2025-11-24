import express from 'express'
import { getAllCourse, getCourseId, seedCourses } from '../controllers/courseController.js'

const courseRouter = express.Router()

courseRouter.get('/all', getAllCourse)
courseRouter.get('/:id', getCourseId)
courseRouter.post('/seed', seedCourses)

export default courseRouter;
