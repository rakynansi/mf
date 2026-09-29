require("dotenv").config();

const express = require("express");
const cors = require("cors");
const webpush = require("web-push");

const app = express();

app.use(cors());
app.use(express.json());

webpush.setVapidDetails(
    "mailto:your@email.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

let savedSubscription = null;


// استقبال الاشتراك
app.post("/subscribe", (req, res) => {

    savedSubscription = req.body;

    console.log("Subscription received!");

    res.status(201).json({
        success: true
    });
});


// إرسال إشعار تجريبي
app.get("/send-test", async (req, res) => {

    console.log("Send-test route called!");

    if (!savedSubscription) {
        return res.status(400).json({
            success: false,
            message: "No subscription found"
        });
    }

    try {

        await webpush.sendNotification(
            savedSubscription,
            JSON.stringify({
                title: "💕 Our World",
                body: "This is a test notification!",
                url: "/"
            })
        );

        console.log("Test notification sent!");

        res.json({
            success: true
        });

    } catch (error) {

        console.error("Notification error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


app.listen(3000, () => {
    console.log("Push server running on port 3000");
});