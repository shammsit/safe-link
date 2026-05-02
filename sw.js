self.addEventListener("push", event => {

    const data = event.data.json();

    const options = {
        body: data.message,
        icon: "/logo.png",
        badge: "/logo.png",
        vibrate: [200, 100, 200],
        data: {
            lat: data.latitude,
            lng: data.longitude
        }
    };

    event.waitUntil(
        self.registration.showNotification("🚨 Emergency Alert", options)
    );
});

// Click action
self.addEventListener("notificationclick", event => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow("/notification/notification.html")
    );
});
async function subscribeUser(){

    const reg = await navigator.serviceWorker.ready;

    const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "YOUR_VAPID_PUBLIC_KEY"
    });

    console.log("Subscribed:", subscription);

    // Save to Supabase
    await supabaseClient
        .from("push_subscriptions")
        .insert([{ subscription }]);
}
webpush.sendNotification(subscription, JSON.stringify({
    message: "Help needed!",
    latitude: 22.57,
    longitude: 88.36
}));