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

  const isFree =
    Number(discountedPrice) <= 0 ||
    (course.discount >= 100 && course.coursePrice > 0)

  return (
    <Link
      to={'/course/' + course._id}
      onClick={() => scrollTo(0, 0)}
      className='border border-gray-200 pb-4 overflow-hidden rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 hover:ring-4 hover:ring-blue-100/80 transition-all duration-300 flex flex-col h-full bg-white'
    >
      {/* Thumbnail */}
      <div className='w-full h-44 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 relative'>
        <img
          className='w-full h-full object-cover'
          src={course.courseThumbnail || '/placeholder.png'}
          alt={course.courseTitle}
          onError={(e) => {
            e.target.src = '/placeholder.png'
          }}
        />
        {isFree && (
          <span className='absolute left-2 top-2 rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm'>
            Free
          </span>
        )}
      </div>

      {/* Info */}
      <div className='p-4 flex flex-col gap-1 flex-1'>
        <h3 className='text-base font-semibold text-gray-800 line-clamp-2 min-h-[2.75rem]'>
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
        <div className='flex flex-wrap items-center gap-2 mt-auto pt-2'>
          <p className={`text-base font-bold ${isFree ? 'text-emerald-700' : 'text-gray-900'}`}>
            {isFree ? (
              <>
                {currency}0.00
                {course.coursePrice > 0 && course.discount >= 100 && (
                  <span className='ml-2 text-xs font-normal text-gray-500'>
                    (was {currency}
                    {course.coursePrice?.toFixed(2)})
                  </span>
                )}
              </>
            ) : (
              <>
                {currency}
                {discountedPrice}
              </>
            )}
          </p>
          {course.discount > 0 && course.discount < 100 && (
            <>
              <p className='text-sm text-gray-400 line-through'>
                {currency}
                {course.coursePrice?.toFixed(2)}
              </p>
              <span className='text-xs text-green-600 font-semibold'>{course.discount}% off</span>
            </>
          )}
          {course.discount >= 100 && course.coursePrice > 0 && (
            <span className='text-xs font-semibold text-emerald-600'>100% off · YouTube</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CourseCard