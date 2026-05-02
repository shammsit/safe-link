// 🔔 Listen for push events
self.addEventListener("push", event => {

    const data = event.data ? event.data.json() : {};

    const options = {
        body: data.message || "🚨 Emergency Alert!",
        icon: "/logo.png",
        badge: "/logo.png",
        vibrate: [200, 100, 200],
        data: data
    };

    event.waitUntil(
        self.registration.showNotification("🚨 Safe Link Alert", options)
    );
});


// 🔁 When user clicks notification
self.addEventListener("notificationclick", event => {

    event.notification.close();

    event.waitUntil(
        clients.openWindow("/notification/notification.html")
    );
});

