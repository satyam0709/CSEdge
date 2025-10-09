import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialsSection = () => {
  return (
    <div className="pb-14 px-8 md:px-0">
      {/* Section Header */}
      <h2 className="text-3xl font-medium text-gray-800">Testimonials</h2>
      <p className="md:text-base text-gray-500 mt-3">
        Hear from our learners about their experiences with our courses and how <br />
        it has helped them achieve their goals.
      </p>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-6 my-6 md:w-2/3 mx-auto overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Feedback Text */}
            <p className="text-gray-600 italic mb-4">
              “{testimonial.feedback}”
            </p>

            {/* Rating & User Info */}
            <div className="flex items-center justify-between">
              {/* Star Rating */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={
                      testimonial.rating > i
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                    className="w-4 h-4"
                  />
                ))}
              </div>

              {/* User Details */}
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  {testimonial.name}
                </p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
            <a className='text-blue-500  underline px-5' href='#'>Read More</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
