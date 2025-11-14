import { Webhook } from "svix";
import User from "../models/user.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/course.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("Webhook endpoint hit");

    const payloadBuffer = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));

    console.log("Raw body length:", payloadBuffer.length);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    console.log("Headers received:", headers);

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const evt = whook.verify(payloadBuffer, headers);

    console.log("Event type:", evt.type);
    console.log("Event data:", evt.data);

    switch (evt.type) {
      case "user.created":
        try {
          const newUser = await User.create({
            _id: evt.data.id,
            email: evt.data.email_addresses?.[0]?.email_address || "",
            name: `${evt.data.first_name || ""} ${evt.data.last_name || ""}`.trim() || "User",
            imageUrl: evt.data.image_url || "default-image-url",
          });
          console.log("User created successfully:", newUser);
        } catch (dbError) {
          console.error("Database error creating user:", dbError);
          throw dbError;
        }
        break;

      case "user.updated":
        await User.findByIdAndUpdate(evt.data.id, {
          email: evt.data.email_addresses?.[0]?.email_address || "",
          name: `${evt.data.first_name || ""} ${evt.data.last_name || ""}`.trim() || "User",
          imageUrl: evt.data.image_url || "default-image-url",
        });
        console.log("User updated:", evt.data.id);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(evt.data.id);
        console.log("User deleted:", evt.data.id);
        break;

      default:
        console.log("Unhandled webhook type:", evt.type);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error.message || error);
    console.error("Full error:", error);
    return res.status(400).json({ success: false, message: error.message || 'webhook error' });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;

  try {
    // Construct the Stripe event
    event = stripeInstance.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id; // Fixed: lowercase 'id'

        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1
        });

        if (!sessions.data || sessions.data.length === 0) {
          console.error('No checkout session found for payment intent:', paymentIntentId);
          break;
        }

        const { purchaseId } = sessions.data[0].metadata;

        if (!purchaseId) {
          console.error('No purchaseId found in session metadata');
          break;
        }

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.error('Purchase not found:', purchaseId);
          break;
        }

        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId.toString());

        if (!userData || !courseData) {
          console.error('User or Course not found');
          break;
        }

        // Update course with enrolled student
        if (!courseData.enrolledStudents.includes(userData._id)) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
        }

        // Update user with enrolled course
        if (!userData.enrolledCourses.includes(courseData._id)) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        // Update purchase status
        purchaseData.status = 'completed';
        await purchaseData.save();

        console.log('Payment succeeded and enrollment completed for purchase:', purchaseId);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id; // Fixed: lowercase 'id'

        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1
        });

        if (!sessions.data || sessions.data.length === 0) {
          console.error('No checkout session found for failed payment intent:', paymentIntentId);
          break;
        }

        const { purchaseId } = sessions.data[0].metadata;

        if (!purchaseId) {
          console.error('No purchaseId found in session metadata');
          break;
        }

        const purchaseData = await Purchase.findById(purchaseId);
        if (purchaseData) {
          purchaseData.status = 'failed';
          await purchaseData.save();
          console.log('Payment failed for purchase:', purchaseId);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Send success response
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ 
      error: 'Webhook processing failed', 
      message: error.message 
    });
  }
};