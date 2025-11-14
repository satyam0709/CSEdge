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

// ...existing code...

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
        // req.body is raw buffer because server registers express.raw for this route
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Stripe constructEvent error:", err.message || err);
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    try {
        // Support both checkout.session.completed (preferred) and payment_intent.succeeded
        let session = null;

        if (event.type === "checkout.session.completed") {
            session = event.data.object;
        } else if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;
            const sessionList = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntent.id,
                limit: 1,
            });
            session = sessionList.data && sessionList.data.length ? sessionList.data[0] : null;
        } else if (event.type === "payment_intent.payment_failed") {
            // Handle failed payment separately below
            const paymentIntent = event.data.object;
            const sessionList = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntent.id,
                limit: 1,
            });
            const sessionForFailed = sessionList.data && sessionList.data.length ? sessionList.data[0] : null;
            const purchaseIdFail = sessionForFailed?.metadata?.purchaseId;
            if (purchaseIdFail) {
                const purchase = await Purchase.findById(purchaseIdFail);
                if (purchase) {
                    purchase.status = "failed";
                    await purchase.save();
                    console.log("Marked purchase as failed:", purchaseIdFail);
                }
            }
            return res.json({ received: true });
        } else {
            console.log("Unhandled event type:", event.type);
            return res.json({ received: true });
        }

        if (!session) {
            console.error("No checkout session found for event:", event.type);
            return res.status(400).json({ error: "Checkout session not found" });
        }

        const purchaseId = session.metadata?.purchaseId;
        if (!purchaseId) {
            console.error("No purchaseId in session metadata:", session.id);
            return res.status(400).json({ error: "Missing purchaseId in session metadata" });
        }

        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
            console.error("Purchase not found:", purchaseId);
            return res.status(404).json({ error: "Purchase not found" });
        }

        // If already completed, return early (idempotency)
        if (purchase.status === "completed") {
            console.log("Purchase already completed:", purchaseId);
            return res.json({ received: true });
        }

        // Load user and course
        const user = await User.findById(purchase.userId);
        const course = await Course.findById(purchase.courseId);

        if (!user || !course) {
            console.error("Missing user or course for purchase:", purchaseId);
            return res.status(404).json({ error: "Related user or course not found" });
        }

        // Add student to course.enrolledStudents (no duplicates)
        if (!course.enrolledStudents?.includes(user._id)) {
            course.enrolledStudents = course.enrolledStudents || [];
            course.enrolledStudents.push(user._id);
            await course.save();
            console.log(`Added user ${user._id} to course ${course._id}`);
        } else {
            console.log(`User ${user._id} already enrolled in course ${course._id}`);
        }

        // Add course to user.enrolledCourses (no duplicates)
        if (!user.enrolledCourses?.some(id => id.toString() === course._id.toString())) {
            user.enrolledCourses = user.enrolledCourses || [];
            user.enrolledCourses.push(course._id);
            await user.save();
            console.log(`Added course ${course._id} to user ${user._id}`);
        } else {
            console.log(`Course ${course._id} already present for user ${user._id}`);
        }

        // Mark purchase completed
        purchase.status = "completed";
        await purchase.save();
        console.log("Marked purchase completed:", purchaseId);

        return res.json({ received: true });
    } catch (err) {
        console.error("Error handling stripe webhook:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// ...existing code...