import { Webhook } from "svix";
import User from "../models/user.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from '../models/course.js';

// Initialize Stripe instance
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// ------------------------ CLERK WEBHOOK ------------------------
export const clerkWebhooks = async (req, res) => {
    try {
        const payloadBuffer = Buffer.isBuffer(req.body)
            ? req.body
            : Buffer.from(
                  typeof req.body === "string"
                      ? req.body
                      : JSON.stringify(req.body)
              );

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const evt = wh.verify(payloadBuffer, headers);

        console.log("Clerk webhook event:", evt.type);

        switch (evt.type) {
            case "user.created":
                const newUser = await User.create({
                    _id: evt.data.id,
                    email: evt.data.email_addresses?.[0]?.email_address || "",
                    name: `${evt.data.first_name || ""} ${evt.data.last_name || ""}`.trim() || "User",
                    imageUrl: evt.data.image_url || ""
                });
                console.log("User created:", newUser._id);
                break;

            case "user.updated":
                await User.findByIdAndUpdate(evt.data.id, {
                    email: evt.data.email_addresses?.[0]?.email_address || "",
                    name: `${evt.data.first_name || ""} ${evt.data.last_name || ""}`.trim(),
                    imageUrl: evt.data.image_url || ""
                });
                console.log("User updated:", evt.data.id);
                break;

            case "user.deleted":
                await User.findByIdAndDelete(evt.data.id);
                console.log("User deleted:", evt.data.id);
                break;

            default:
                console.log("Unhandled Clerk webhook type:", evt.type);
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Clerk webhook error:", err);
        return res.status(400).json({ success: false, message: err.message });
    }
};

// ------------------------ STRIPE WEBHOOK ------------------------
export const stripeWebhooks = async (req, res) => {
    console.log('🎯 STRIPE WEBHOOK HANDLER CALLED');
    console.log('Request path:', req.originalUrl);
    console.log('Stripe signature present?', !!req.headers['stripe-signature']);
    
    const sig = req.headers["stripe-signature"];
    
    if (!sig) {
        console.error('❌ No Stripe signature in request');
        return res.status(400).send('No signature');
    }
    
    // Ensure raw body for signature verification
    const rawBody = Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(typeof req.body === "string" ? req.body : JSON.stringify(req.body));
    
    console.log('Body is Buffer?', Buffer.isBuffer(rawBody));
    console.log('Body length:', rawBody.length);
    
    let event;
    
    try {
        event = stripeInstance.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        
        console.log('✅ Webhook signature verified');
        console.log('Event type:', event.type);
        console.log('Event ID:', event.id);
        
    } catch (err) {
        console.error('❌ Webhook signature verification failed:', err.message);
        console.error('Make sure STRIPE_WEBHOOK_SECRET is correct');
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // ⚠️ THIS WAS MISSING - ACTUALLY PROCESS THE PAYMENT EVENTS!
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                console.log("📦 Checkout session completed:", session.id);
                console.log("Payment status:", session.payment_status);
                console.log("Metadata:", session.metadata);
                
                // Only process if payment was successful
                if (session.payment_status === 'paid') {
                    const { purchaseId } = session.metadata || {};
                    
                    if (!purchaseId) {
                        console.error("❌ No purchaseId in session metadata");
                        break;
                    }
                    
                    console.log("🔄 Processing purchase:", purchaseId);
                    
                    // Find the purchase
                    const purchase = await Purchase.findById(purchaseId);
                    if (!purchase) {
                        console.error("❌ Purchase not found:", purchaseId);
                        break;
                    }
                    
                    // Skip if already completed
                    if (purchase.status === 'completed') {
                        console.log("✓ Purchase already completed:", purchaseId);
                        break;
                    }
                    
                    // Find user and course
                    const user = await User.findById(purchase.userId);
                    const course = await Course.findById(purchase.courseId);
                    
                    if (!user || !course) {
                        console.error("❌ User or course not found");
                        console.error("User ID:", purchase.userId, "Found:", !!user);
                        console.error("Course ID:", purchase.courseId, "Found:", !!course);
                        break;
                    }
                    
                    // Update course enrolled students
                    if (!course.enrolledStudents.includes(user._id)) {
                        course.enrolledStudents.push(user._id);
                        await course.save();
                        console.log("✅ Added user to course enrolledStudents");
                    }
                    
                    // Update user enrolled courses
                    if (!user.enrolledCourses.includes(course._id)) {
                        user.enrolledCourses.push(course._id);
                        await user.save();
                        console.log("✅ Added course to user enrolledCourses");
                    }
                    
                    // Update purchase status
                    purchase.status = "completed";
                    purchase.stripeSessionId = session.id;
                    purchase.paymentIntentId = session.payment_intent;
                    await purchase.save();
                    
                    console.log("🎉 Purchase completed successfully:", purchaseId);
                }
                break;
            }
            
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                console.log("💰 Payment intent succeeded:", paymentIntent.id);
                
                // This is a backup in case checkout.session.completed doesn't fire
                // Wait a bit for session to be available
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Find the checkout session for this payment intent
                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                    limit: 1
                });
                
                if (!sessions.data.length) {
                    console.log("⚠️ No session found for payment intent:", paymentIntent.id);
                    break;
                }
                
                const session = sessions.data[0];
                const { purchaseId } = session.metadata || {};
                
                if (!purchaseId) {
                    console.error("❌ No purchaseId in session metadata");
                    break;
                }
                
                // Process the purchase (same logic as above)
                const purchase = await Purchase.findById(purchaseId);
                if (!purchase || purchase.status === 'completed') {
                    console.log("⏭️ Purchase already processed or not found");
                    break;
                }
                
                const user = await User.findById(purchase.userId);
                const course = await Course.findById(purchase.courseId);
                
                if (user && course) {
                    if (!course.enrolledStudents.includes(user._id)) {
                        course.enrolledStudents.push(user._id);
                        await course.save();
                    }
                    
                    if (!user.enrolledCourses.includes(course._id)) {
                        user.enrolledCourses.push(course._id);
                        await user.save();
                    }
                    
                    purchase.status = "completed";
                    purchase.paymentIntentId = paymentIntent.id;
                    await purchase.save();
                    
                    console.log("🎉 Purchase completed via payment_intent:", purchaseId);
                }
                break;
            }
            
            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                console.log("❌ Payment failed:", paymentIntent.id);
                
                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                    limit: 1
                });
                
                if (sessions.data.length) {
                    const { purchaseId } = sessions.data[0].metadata || {};
                    if (purchaseId) {
                        const purchase = await Purchase.findById(purchaseId);
                        if (purchase && purchase.status === 'pending') {
                            purchase.status = "failed";
                            purchase.failureReason = paymentIntent.last_payment_error?.message || "Payment failed";
                            await purchase.save();
                            console.log("❌ Purchase marked as failed:", purchaseId);
                        }
                    }
                }
                break;
            }
            
            case "checkout.session.expired": {
                const session = event.data.object;
                const { purchaseId } = session.metadata || {};
                
                if (purchaseId) {
                    const purchase = await Purchase.findById(purchaseId);
                    if (purchase && purchase.status === 'pending') {
                        purchase.status = "expired";
                        await purchase.save();
                        console.log("⏰ Purchase marked as expired:", purchaseId);
                    }
                }
                break;
            }
            
            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }
        
        // Always return 200 to acknowledge receipt
        res.status(200).json({ received: true });
        
    } catch (error) {
        console.error("💥 Error processing webhook:", error);
        // Still return 200 to prevent retries for processing errors
        res.status(200).json({ 
            received: true, 
            error: error.message 
        });
    }
};

// ------------------------ MANUAL STATUS CHECK (FALLBACK) ------------------------
export const checkPurchaseStatus = async (req, res) => {
    try {
        const { purchaseId } = req.params;
        const userId = req.auth().userId;

        const purchase = await Purchase.findById(purchaseId);
        
        if (!purchase) {
            return res.json({ success: false, message: 'Purchase not found' });
        }

        // Verify the purchase belongs to the user
        if (purchase.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized' });
        }

        // If already completed, return current status
        if (purchase.status === 'completed') {
            return res.json({ 
                success: true, 
                status: 'completed',
                message: 'Purchase already completed' 
            });
        }

        // Check with Stripe for the actual status
        if (purchase.stripeSessionId) {
            const session = await stripeInstance.checkout.sessions.retrieve(
                purchase.stripeSessionId
            );

            if (session.payment_status === 'paid') {
                // Update purchase status
                const user = await User.findById(purchase.userId);
                const course = await Course.findById(purchase.courseId);

                if (user && course) {
                    // Update enrollments
                    if (!course.enrolledStudents.includes(user._id)) {
                        course.enrolledStudents.push(user._id);
                        await course.save();
                    }

                    if (!user.enrolledCourses.includes(course._id)) {
                        user.enrolledCourses.push(course._id);
                        await user.save();
                    }

                    purchase.status = "completed";
                    await purchase.save();

                    console.log("Purchase status manually updated:", purchaseId);

                    return res.json({ 
                        success: true, 
                        status: 'completed',
                        message: 'Purchase completed successfully' 
                    });
                }
            }
        }

        res.json({ 
            success: true, 
            status: purchase.status,
            purchase 
        });
    } catch (error) {
        console.error("Check purchase status error:", error);
        res.json({ success: false, message: error.message });
    }
};

// ------------------------ MANUAL BULK CHECK FOR PENDING PURCHASES ------------------------
export const checkAllPendingPurchases = async (req, res) => {
    try {
        console.log("🔍 Checking all pending purchases...");
        
        // Find all pending purchases
        const pendingPurchases = await Purchase.find({ status: 'pending' });
        console.log(`Found ${pendingPurchases.length} pending purchases`);
        
        let updated = 0;
        let errors = 0;
        
        for (const purchase of pendingPurchases) {
            try {
                // Try to find the session in Stripe
                const sessions = await stripeInstance.checkout.sessions.list({
                    limit: 100,
                });
                
                const session = sessions.data.find(s => 
                    s.metadata?.purchaseId === purchase._id.toString()
                );
                
                if (session && session.payment_status === 'paid') {
                    console.log(`Processing pending purchase: ${purchase._id}`);
                    
                    const user = await User.findById(purchase.userId);
                    const course = await Course.findById(purchase.courseId);
                    
                    if (user && course) {
                        // Update enrollments
                        if (!course.enrolledStudents.includes(user._id)) {
                            course.enrolledStudents.push(user._id);
                            await course.save();
                        }
                        
                        if (!user.enrolledCourses.includes(course._id)) {
                            user.enrolledCourses.push(course._id);
                            await user.save();
                        }
                        
                        // Update purchase status
                        purchase.status = 'completed';
                        purchase.stripeSessionId = session.id;
                        await purchase.save();
                        
                        updated++;
                        console.log(`✅ Updated purchase ${purchase._id} to completed`);
                    }
                }
            } catch (err) {
                errors++;
                console.error(`Error processing purchase ${purchase._id}:`, err.message);
            }
        }
        
        const message = `Processed ${pendingPurchases.length} pending purchases. Updated: ${updated}, Errors: ${errors}`;
        console.log(message);
        
        res.json({ 
            success: true, 
            message,
            stats: {
                total: pendingPurchases.length,
                updated,
                errors
            }
        });
    } catch (error) {
        console.error('Error checking pending purchases:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};