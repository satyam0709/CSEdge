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
    origin: 'http://localhost:5173',
    credentials: true
}));

// ❗ Stripe webhook MUST be before ANY body parsers or Clerk middleware
app.post('/webhooks/stripe', 
    express.raw({ type: 'application/json' }), 
    stripeWebhooks
);

// ❗ Clerk webhook also needs raw
app.post('/clerk', 
    express.raw({ type: 'application/json' }), 
    clerkWebhooks
);

// All other routes → now safe to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk middleware (AFTER webhook ONLY)
app.use(clerkMiddleware());

// Routes (NO extra express.json())
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
