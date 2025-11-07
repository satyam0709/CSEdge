// api/clerk.js
import { Webhook } from 'svix';
import mongoose from 'mongoose';

// Define User schema here since we need it for Vercel
const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    email: { type: String, required: true },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// MongoDB connection
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Connect to MongoDB
        await connectDB();

        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        
        if (!webhookSecret) {
            throw new Error('CLERK_WEBHOOK_SECRET not configured');
        }

        // Create webhook instance
        const wh = new Webhook(webhookSecret);
        
        // Get headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // Verify the webhook
        const body = JSON.stringify(req.body);
        const evt = wh.verify(body, headers);
        
        console.log('Webhook event type:', evt.type);
        console.log('User data:', evt.data);

        // Handle events
        switch (evt.type) {
            case 'user.created':
                const newUser = await User.create({
                    _id: evt.data.id,
                    email: evt.data.email_addresses[0].email_address,
                    name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim() || 'User',
                    imageUrl: evt.data.image_url || 'default-url'
                });
                console.log('User created in DB:', newUser);
                break;

            case 'user.updated':
                await User.findByIdAndUpdate(evt.data.id, {
                    email: evt.data.email_addresses[0].email_address,
                    name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim() || 'User',
                    imageUrl: evt.data.image_url || 'default-url'
                });
                console.log('User updated:', evt.data.id);
                break;

            case 'user.deleted':
                await User.findByIdAndDelete(evt.data.id);
                console.log('User deleted:', evt.data.id);
                break;

            default:
                console.log('Unhandled event type:', evt.type);
        }

        return res.status(200).json({ success: true });
        
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(400).json({ 
            error: 'Webhook error', 
            message: error.message 
        });
    }
}

// CRITICAL: Disable bodyParser for webhooks
export const config = {
    api: {
        bodyParser: false,
    },
};