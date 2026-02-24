import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext)

  if (!course) return null

  const rating = calculateRating(course)

  // FIX: was using course.price (undefined). Correct field is course.coursePrice
  const discountedPrice =
    course.coursePrice > 0
      ? (course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2)
      : '0.00'

  return (
    <Link
      to={'/course/' + course._id}
      onClick={() => scrollTo(0, 0)}
      className='border border-gray-200 pb-4 overflow-hidden rounded-xl hover:shadow-md transition-shadow duration-300 flex flex-col'
    >
      {/* Thumbnail */}
      <div className='w-full h-44 overflow-hidden bg-gray-100'>
        <img
          className='w-full h-full object-cover'
          src={course.courseThumbnail || '/placeholder.png'}
          alt={course.courseTitle}
          onError={(e) => {
            e.target.src = '/placeholder.png'
          }}
        />
      </div>

      {/* Info */}
      <div className='p-4 flex flex-col gap-1 flex-1'>
        <h3 className='text-base font-semibold text-gray-800 line-clamp-2'>
          {course.courseTitle}
        </h3>
        <p className='text-sm text-gray-500'>
          {course.educator?.name || 'CSEdge'}
        </p>

        {/* Stars + rating count */}
        <div className='flex items-center gap-2 mt-1'>
          <span className='text-sm font-medium text-gray-700'>{rating}</span>
          <div className='flex'>
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                src={index < Math.floor(rating) ? assets.star : assets.star_blank}
                alt='star'
                className='w-4 h-4'
              />
            ))}
          </div>
          <span className='text-sm text-gray-400'>
            ({course.courseRatings?.length || 0})
          </span>
        </div>

        {/* Price */}
        <div className='flex items-center gap-2 mt-2'>
          <p className='text-base font-bold text-gray-900'>
            {currency}
            {discountedPrice}
          </p>
          {course.discount > 0 && (
            <>
              <p className='text-sm text-gray-400 line-through'>
                {currency}
                {course.coursePrice?.toFixed(2)}
              </p>
              <span className='text-xs text-green-600 font-semibold'>
                {course.discount}% off
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CourseCard