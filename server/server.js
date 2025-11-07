import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';

const app = express();

// Connect to MongoDB first
await connectDB();

app.use(cors());

// DO NOT register global JSON parser before webhook route
app.get('/', (req, res) => res.send("API working"));

// IMPORTANT: Use express.raw() for webhooks ONLY and ensure it runs before express.json()
app.post(
  '/clerk', 
  express.raw({ type: 'application/json' }), 
  clerkWebhooks
);

// register body parser for all other routes after webhook
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
