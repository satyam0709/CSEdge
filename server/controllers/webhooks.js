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

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
export const stripeWebhooks = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
        // req.body must be the raw buffer (express.raw set on route)
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log("Stripe event received:", event.id, event.type);
    } catch (err) {
        console.error("Stripe constructEvent error:", err.message || err);
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    try {
        // Accept several successful payment event types
        let session = null;

        if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
            session = event.data.object;
        } else if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;
            const sessionList = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntent.id,
                limit: 1,
            });
            session = sessionList.data && sessionList.data.length ? sessionList.data[0] : null;
        } else if (event.type === "payment_intent.payment_failed") {
            const paymentIntent = event.data.object;
            const sessionList = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntent.id,
                limit: 1,
            });
            const sessionForFailed = sessionList.data && sessionList.data.length ? sessionList.data[0] : null;
            const purchaseIdFail = sessionForFailed?.metadata?.purchaseId || sessionForFailed?.client_reference_id;
            if (purchaseIdFail) {
                await Purchase.findByIdAndUpdate(purchaseIdFail, { status: "failed" });
                console.log("Marked purchase as failed:", purchaseIdFail);
            }
            return res.json({ received: true });
        } else {
            console.log("Unhandled event type:", event.type);
            return res.json({ received: true });
        }

        if (!session) {
            console.error("No checkout session found for event:", event.type, event.id);
            return res.status(400).json({ error: "Checkout session not found" });
        }

        // prefer metadata.purchaseId, fallback to client_reference_id
        const purchaseId = session.metadata?.purchaseId || session.client_reference_id;
        if (!purchaseId) {
            console.error("No purchaseId or client_reference_id in session:", session.id, session);
            return res.status(400).json({ error: "Missing purchase id in session metadata" });
        }

        // Use transaction + $addToSet to ensure idempotency and avoid duplicates
        const dbSession = await mongoose.startSession();
        try {
            dbSession.startTransaction();

            const purchase = await Purchase.findById(purchaseId).session(dbSession);
            if (!purchase) {
                await dbSession.abortTransaction();
                console.error("Purchase not found:", purchaseId);
                return res.status(404).json({ error: "Purchase not found" });
            }

            if (purchase.status === "completed") {
                await dbSession.commitTransaction();
                console.log("Purchase already completed:", purchaseId);
                return res.json({ received: true });
            }

            // addToSet avoids duplicate enrollments
            await Course.updateOne(
                { _id: purchase.courseId },
                { $addToSet: { enrolledStudents: purchase.userId } }
            ).session(dbSession);

            await User.updateOne(
                { _id: purchase.userId },
                { $addToSet: { enrolledCourses: purchase.courseId } }
            ).session(dbSession);

            purchase.status = "completed";
            await purchase.save({ session: dbSession });

            await dbSession.commitTransaction();
            console.log("Purchase completed and enrollment updated:", purchaseId);
            return res.json({ received: true });
        } catch (txErr) {
            await dbSession.abortTransaction();
            console.error("Transaction error:", txErr);
            throw txErr;
        } finally {
            dbSession.endSession();
        }
    } catch (err) {
        console.error("Error handling stripe webhook:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};