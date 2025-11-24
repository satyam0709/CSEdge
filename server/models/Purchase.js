import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'expired'],
        default: 'pending'
    },
    stripeSessionId: {
        type: String,
        default: null
    },
    paymentIntentId: {
        type: String,
        default: null
    },
    failureReason: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Add index for faster queries
PurchaseSchema.index({ userId: 1, courseId: 1 });
PurchaseSchema.index({ stripeSessionId: 1 });
PurchaseSchema.index({ status: 1 });

export const Purchase = mongoose.model('Purchase', PurchaseSchema);