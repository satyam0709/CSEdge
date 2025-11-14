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

export const stripeWebhooks = async(req,res)=>{
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.Id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      })

      const {purchaseId} = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId)
      const userData = await User.findById(purchaseData.userId)
      const courseData = await Course.findById(purchaseData.courseId.toString())

      courseData.enrolledStudents.push(userData)
      await courseData.save()

      userData.enrolledCourses.push(courseData._id)
      await userData.save()

      purchaseData.status = 'completed'
      await purchaseData.save()

      break;
    }
    case 'payment_intent.payment_failed':{
     
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.Id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      })

      const {purchaseId} = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId)

      purchaseData.status = 'failed'
      await purchaseData.save()

      break;
    
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({received: true})

}
