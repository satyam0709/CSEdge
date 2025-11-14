import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import { clerkMiddleware } from '@clerk/express';
import educatorRouter from './routes/educatorRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
await connectDB();
await connectCloudinary();

app.use(cors({
    origin: 'http://localhost:5173', // Your Vite dev server
    credentials: true
}));

app.use(clerkMiddleware());
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
app.use('/api/educator', express.json() , educatorRouter);
app.use('/api/course' , express.json() , courseRouter);
app.use('/api/user' , express.json(), userRouter)
app.post('/stripe' , express.raw({type: 'application/json'}), stripeWebhooks)

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