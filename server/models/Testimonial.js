import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    feedback: {
      type: String,
      required: true,
      maxlength: 2000,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
