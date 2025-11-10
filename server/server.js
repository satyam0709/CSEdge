import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import { clerkMiddleware } from '@clerk/express';
import educatorRouter from './routes/educatorRoutes.js';
import connectCloudinary from './configs/cloudinary.js';

const app = express();

// Connect to MongoDB first
await connectDB();
await connectCloudinary();

// IMPORTANT: Configure CORS before routes
app.use(cors({
    origin: 'http://localhost:5173', // Your Vite dev server
    credentials: true
}));

// Clerk middleware should come before routes that need authentication
app.use(clerkMiddleware());

// Root route
app.get('/', (req, res) => res.send("API working"));

// Webhook route with raw body parser (must be before express.json())
app.post(
  '/clerk', 
  express.raw({ type: 'application/json' }), 
  clerkWebhooks
);

// Body parser for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/educator', educatorRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});