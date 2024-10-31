import React from "react";
import NotificationSetup from "./NotificationService";

function App() {
  return (
    <div className="App">
      <NotificationSetup/>
      <h1>AWS Amplify Push Notifications</h1>
      <button>Send Test Notification</button>
    </div>
  );
}

export default App;
