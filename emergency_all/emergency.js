let userMarker = null;
let currentSOSId = null;
let watchId = null;
let helperMarkers = {};
let helperRoutes = {};
let map;

// ================= MAP =================
window.onload = function(){
    map = L.map('map').setView([22.5726, 88.3639], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
    }).addTo(map);
};

// ================= SOS =================
const sosBtn = document.querySelector(".emergency-btn");

sosBtn.addEventListener("click", async () => {

    if (!navigator.geolocation) {
        alert("❌ Location not supported");
        return;
    }

    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }

    watchId = navigator.geolocation.watchPosition(async (position) => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // 🔴 Victim marker
        if(userMarker){
            map.removeLayer(userMarker);
        }

        userMarker = L.marker([lat, lng]).addTo(map)
            .bindPopup("🚨 You (SOS)").openPopup();

        try {

            if (!currentSOSId) {

                const res = await fetch("https://api.ipify.org?format=json");
                const ipData = await res.json();
                const ip = ipData.ip;

                const { data } = await supabaseClient
                    .from("sos_alerts")
                    .insert([{
                        ip_address: ip,
                        latitude: lat,
                        longitude: lng,
                        message: "I need help"
                    }])
                    .select()
                    .single();

                currentSOSId = data.id;

                console.log("SOS ID:", currentSOSId);

                trackHelpersLive(); // ✅ IMPORTANT

            } else {

                await supabaseClient
                    .from("sos_alerts")
                    .update({
                        latitude: lat,
                        longitude: lng
                    })
                    .eq("id", currentSOSId);
            }

        } catch (err) {
            console.error(err);
        }

    }, console.error, {
        enableHighAccuracy: true
    });
});

// ================= TRACK HELPERS =================
function trackHelpersLive(){

    setInterval(async () => {

        if (!currentSOSId || !userMarker) return;

        const { data } = await supabaseClient
            .from("help_responses")
            .select("*")
            .eq("sos_id", currentSOSId);

        console.log("Helpers:", data);

        data.forEach(helper => {

            const id = helper.id;
            const lat = helper.latitude;
            const lng = helper.longitude;

            // 🟢 Marker
            if (helperMarkers[id]) {
                helperMarkers[id].setLatLng([lat, lng]);
            } else {
                const icon = L.icon({
                    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    iconSize: [32, 32]
                });

                helperMarkers[id] = L.marker([lat, lng], { icon })
                    .addTo(map);
            }

            // 📏 Distance
            const victim = userMarker.getLatLng();
            const distance = map.distance(
                [victim.lat, victim.lng],
                [lat, lng]
            );

            helperMarkers[id].bindPopup(
                `🟢 Helper<br>${(distance/1000).toFixed(2)} km`
            );

            // 🛣 Route line
            if (helperRoutes[id]) {
                helperRoutes[id].setLatLngs([
                    [victim.lat, victim.lng],
                    [lat, lng]
                ]);
            } else {
                helperRoutes[id] = L.polyline([
                    [victim.lat, victim.lng],
                    [lat, lng]
                ], { color: 'green' }).addTo(map);
            }

        });

    }, 2000);
}