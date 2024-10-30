import React, { useEffect } from "react";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { PushNotification } from "@aws-amplify/pushnotification";
import NotificationService from "./NotificationService"; // Import NotificationService

Amplify.configure(awsconfig);

function App() {
  useEffect(() => {
    requestPermission();
    NotificationService.setupNotificationListener();
  }, []);

  const requestPermission = async () => {
    const permission = await PushNotification.requestPermissions();
    if (permission === "granted") {
      const token = await PushNotification.getToken();
      console.log("Notification token:", token);
      // You can send the token to your backend to store it for notifications
    }
  };

  return (
    <div className="App">
      <h1>AWS Amplify Push Notifications</h1>
      <button onClick={NotificationService.sendTestNotification}>
        Send Test Notification
      </button>
    </div>
  );
}

export default App;
