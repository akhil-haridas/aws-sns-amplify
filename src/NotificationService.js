// NotificationSetup.js
import React, { useEffect } from 'react';

function NotificationSetup() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registered');
                    return registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: '<YOUR_PUBLIC_VAPID_KEY>',
                    });
                })
                .then((subscription) => {
                    // Register subscription with the backend
                    fetch('http://localhost:4000/subscribe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ endpoint: subscription.endpoint }),
                    });
                })
                .catch(console.error);
        }
    }, []);

    return <div>Notifications are ready!</div>;
}

export default NotificationSetup;
