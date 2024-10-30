import { PushNotification } from "@aws-amplify/pushnotification";
import axios from "axios";

const NotificationService = {
    setupNotificationListener: () => {
        PushNotification.onNotification((notification) => {
            console.log("Notification received:", notification);
            // Here you can handle what happens when a notification is received
        });

        PushNotification.onNotificationOpened((notification) => {
            console.log("Notification opened:", notification);
            // Handle notification click
        });
    },

    sendTestNotification: async () => {
        try {
            // Replace this URL with your backend API endpoint that sends notifications
            const response = await axios.post(
                "https://your-api-url/send-notification",
                {
                    title: "Test Notification",
                    body: "This is a test notification from AWS Amplify!",
                }
            );
            console.log("Notification sent:", response.data);
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    },
};

export default NotificationService;
