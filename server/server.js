import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';

const app = express();

// Connect to MongoDB first
await connectDB();

app.use(cors());
app.use(express.json()); // General JSON parsing for other routes

app.get('/', (req, res) => res.send("API working"));

// IMPORTANT: Use express.raw() for webhooks ONLY
app.post(
  '/clerk', 
  express.raw({ type: 'application/json' }), 
  clerkWebhooks
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});