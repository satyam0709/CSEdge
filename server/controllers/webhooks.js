import { Webhook } from "svix";
import User from "../models/user.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from'../models/course.js';

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

export const stripeWebhooks = async (req, res) => {
  let event;

  const sig = req.headers["stripe-signature"];

  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object; 
      const paymentIntentId = paymentIntent.id;

      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      if (!sessionList.data.length) {
        console.error("No checkout session found for intent", paymentIntentId);
        return res.status(400).json({ error: "Session not found" });
      }

      const session = sessionList.data[0];
      const { purchaseId } = session.metadata;

      const purchase = await Purchase.findById(purchaseId);
      const user = await User.findById(purchase.userId);
      const course = await Course.findById(purchase.courseId);

      course.enrolledStudents.push(user._id);
      await course.save();

      user.enrolledCourses.push(course._id);
      await user.save();

      purchase.status = "completed";
      await purchase.save();

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object; 
      const paymentIntentId = paymentIntent.id;

      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const session = sessionList.data[0];
      const { purchaseId } = session.metadata;

      const purchase = await Purchase.findById(purchaseId);
      purchase.status = "failed";
      await purchase.save();

      break;
    }

    default:
      console.log("Unhandled event:", event.type);
  }

  res.json({ received: true });
};
