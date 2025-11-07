import { Webhook } from "svix";
import User from "../models/user.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("Webhook endpoint hit");
    
    // CRITICAL: Don't use toString('utf8') on an already parsed body
    const payloadString = req.body; // This should be a Buffer
    
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    console.log("Headers received:", headers);

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    
    // Verify webhook - this returns the parsed payload
    const evt = whook.verify(payloadString, headers);
    
    console.log("Event type:", evt.type);
    console.log("Event data:", evt.data);

    switch (evt.type) {
      case "user.created":
        try {
          const newUser = await User.create({
            _id: evt.data.id,
            email: evt.data.email_addresses[0].email_address,
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
          email: evt.data.email_addresses[0].email_address,
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
    console.error("Webhook error:", error.message);
    console.error("Full error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};