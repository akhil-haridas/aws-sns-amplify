import React, { useEffect } from 'react';

const vapidPublicKey = 'BE2horS7WnET4R7_vN5X0GxQBXTpps3_023v2z_N4E9Q5VF-yvrpF5uOZ4f7CIjKhSDnTme_UtDAZZXBKAdlCwI';

function NotificationSetup() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    return registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: vapidPublicKey
                    });
                })
                .then(subscription => {
                    return fetch('http://localhost:4000/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ endpoint: subscription.endpoint })
                    });
                })
                .catch(console.error);
        }
    }, []);

    return <div>Notifications set up!</div>;
}

export default NotificationSetup;
