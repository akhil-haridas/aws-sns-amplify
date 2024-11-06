import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Backend URL

function App() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [subscription, setSubscription] = useState(null);

    console.log("subscription ::", subscription);

    // Request permission to send notifications
    useEffect(() => {
        if ("Notification" in window && "serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/service-worker.js")
                .then((registration) => {
                    console.log("Service Worker registered");
                    return registration.pushManager.getSubscription();
                })
                .then((existingSubscription) => {
                    console.log("existingSubscription ::", existingSubscription);

                    if (existingSubscription) {
                        console.log("Existing subscription found, unsubscribing...");
                        // Unsubscribe the existing subscription if it exists
                        existingSubscription.unsubscribe()
                            .then(() => {
                                console.log("Unsubscribed from the existing subscription");
                                return navigator.serviceWorker.ready.then((registration) =>
                                    registration.pushManager.subscribe({
                                        userVisibleOnly: true,
                                        applicationServerKey: urlBase64ToUint8Array(
                                            "BJ4EwHWUsuUNRgHRn_bgNtjXAhIlGZeXtmQB9JdjTHinygmzIGBl9GYIih09IotP3v7k3qESo9RVh825jXUHSZg"
                                        ),
                                    })
                                );
                            })
                            .then((newSubscription) => {
                                if (newSubscription) {
                                    setSubscription(newSubscription);
                                    console.log("New subscription created:", newSubscription);
                                    // Send the subscription to the backend
                                    fetch("http://localhost:5000/subscribe", {
                                        method: "POST",
                                        body: JSON.stringify(newSubscription),
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    })
                                        .then((response) => {
                                            if (response.ok) {
                                                console.log("Subscription successfully sent to backend.");
                                            } else {
                                                console.error("Failed to send subscription to backend.");
                                            }
                                        })
                                        .catch((err) => {
                                            console.error("Error sending subscription to backend:", err);
                                        });
                                }
                            })
                            .catch((err) => {
                                console.error("Error unsubscribing from existing subscription:", err);
                            });
                    } else {
                        console.log("No existing subscription found.");
                        return navigator.serviceWorker.ready.then((registration) =>
                            registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlBase64ToUint8Array(
                                    "BJ4EwHWUsuUNRgHRn_bgNtjXAhIlGZeXtmQB9JdjTHinygmzIGBl9GYIih09IotP3v7k3qESo9RVh825jXUHSZg"
                                ),
                            })
                        );
                    }
                })
                .then((newSubscription) => {
                    if (newSubscription) {
                        setSubscription(newSubscription);
                        console.log("New subscription created:", newSubscription);
                        // Send the subscription to the backend
                        fetch("http://localhost:5000/subscribe", {
                            method: "POST",
                            body: JSON.stringify(newSubscription),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })
                            .then((response) => {
                                if (response.ok) {
                                    console.log("Subscription successfully sent to backend.");
                                } else {
                                    console.error("Failed to send subscription to backend.");
                                }
                            })
                            .catch((err) => {
                                console.error("Error sending subscription to backend:", err);
                            });
                    }
                })
                .catch((error) => {
                    console.error("Error with service worker or push manager", error);
                });
        }
    }, []);

    // Handle incoming messages from WebSocket
    useEffect(() => {
        socket.on("chatMessage", (msg) => {
            console.log("message ::", msg);
            setMessages((prevMessages) => [...prevMessages, msg]);
        });
    }, []);

    // Send a chat message
    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("chatMessage", message);
            setMessage("");
        }
    };

    return (
        <div className="App">
            <h1>Chat Application</h1>
            <div>
                {messages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default App;
