let userMarker = null;
let currentSOSId = null;
let watchId = null;
let helperMarkers = {};
let helperRoutes = {};

// ================= SHARE =================
function shareSite(){
    const shareData = {
        title: "Safe Link – Emergency Support",
        text: "🚨 Emergency features coming soon. Stay connected with Safe Link.",
        url: "https://safe-link.techgen.online/"
    };

    if(navigator.share){
        navigator.share(shareData);
    }else{
        const message = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        navigator.clipboard.writeText(message);
        alert("Link copied!");
    }
}

// ================= CLOCK =================
function updateClock(){
    const now = new Date();

    document.getElementById("liveTime").innerText =
        now.toLocaleTimeString();

    document.getElementById("liveDate").innerText =
        now.toDateString();
}

setInterval(updateClock,1000);
updateClock();

let map;

// ================= MAP =================
window.onload = function(){
    map = L.map('map').setView([22.5726, 88.3639], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
    }).addTo(map);
};

function scrollBelowMap(){
    const target = document.querySelector('.emergency-box');
    if(target){
        target.scrollIntoView({ behavior: 'smooth' });
    }else{
        console.log("Target element not found for scrolling.");
    }
}

// ================= LOCATE =================
const locateBtn = document.querySelector(".locate-btn");

locateBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("❌ Geolocation not supported");
        return;
    }

    locateBtn.innerText = "⏳";

    navigator.geolocation.getCurrentPosition(
        (position) => {

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            map.flyTo([lat, lng], 16);

            if(userMarker){
                map.removeLayer(userMarker);
            }

            userMarker = L.marker([lat, lng]).addTo(map)
                .bindPopup("You are here").openPopup();

            locateBtn.innerText = "📍";
        },
        () => {
            alert("❌ Location access denied");
            locateBtn.innerText = "📍";
        }
    );
});

// ================= SOS =================
const sosBtn = document.querySelector(".emergency-btn");

sosBtn.addEventListener("click", async () => {

    // Auto trigger locate (UI only)
    locateBtn.click();

    // ✅ Cooldown
    const lastSOS = localStorage.getItem("lastSOS");

    if (lastSOS) {
        const elapsed = Math.floor((Date.now() - lastSOS) / 1000);
        const remaining = 60 - elapsed;

        if (remaining > 0) {
            alert(`⏳ Wait ${remaining}s before sending again`);
            return;
        }
    }

    localStorage.setItem("lastSOS", Date.now());

    if (!navigator.geolocation) {
        alert("❌ Location not supported");
        return;
    }

    sosBtn.innerText = "⏳";

    // 🔄 START LIVE TRACKING
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }

    watchId = navigator.geolocation.watchPosition(async (position) => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // ✅ Keep victim marker updated
        if(userMarker){
            map.removeLayer(userMarker);
        }

        userMarker = L.marker([lat, lng]).addTo(map)
            .bindPopup("🚨 You (SOS)").openPopup();

        try {

            // FIRST TIME → INSERT
            if (!currentSOSId) {

                const res = await fetch("https://api.ipify.org?format=json");
                const ipData = await res.json();
                const ip = ipData.ip;

                const now = new Date();
                const istOffset = 5.5 * 60 * 60 * 1000;
                const istDate = new Date(now.getTime() + istOffset).toISOString();

                const { data, error } = await supabaseClient
                    .from("sos_alerts")
                    .insert([
                        {
                            ip_address: ip,
                            latitude: lat,
                            longitude: lng,
                            message: "I need help , please help me",
                            created_at: istDate
                        }
                    ])
                    .select()
                    .single();

                if (error) {
                    console.error(error);
                    alert("❌ Failed to send SOS");
                    sosBtn.innerText = "🚨";
                    return;
                }

                currentSOSId = data.id;

                // ✅ START HELPER TRACKING
                trackHelpersLive();

                alert("🚨 SOS Sent Successfully!");
                sosBtn.innerText = "🚨";

            } else {
                // 🔄 UPDATE LIVE LOCATION
                const { error } = await supabaseClient
                    .from("sos_alerts")
                    .update({
                        latitude: lat,
                        longitude: lng
                    })
                    .eq("id", currentSOSId);

                if (error) {
                    console.error(error);
                }
            }

        } catch (err) {
            console.error(err);
            alert("❌ Error sending SOS");
            sosBtn.innerText = "🚨";
        }

    }, () => {
        alert("❌ Location permission denied");
        sosBtn.innerText = "🚨";
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
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

        data.forEach(helper => {

            const id = helper.id;
            const lat = helper.latitude;
            const lng = helper.longitude;

            // 🟢 MARKER
            if (helperMarkers[id]) {
                helperMarkers[id].setLatLng([lat, lng]);
            } else {
                const greenIcon = L.icon({
                    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    iconSize: [32, 32]
                });

                helperMarkers[id] = L.marker([lat, lng], { icon: greenIcon })
                    .addTo(map);
            }

            // 📏 DISTANCE
            const victim = userMarker.getLatLng();
            const distance = map.distance(
                [victim.lat, victim.lng],
                [lat, lng]
            );

            helperMarkers[id].bindPopup(
                `🟢 Helper<br>Distance: ${(distance/1000).toFixed(2)} km`
            );

            // 🛣 ROUTE LINE
            if (helperRoutes[id]) {
                helperRoutes[id].setLatLngs([
                    [victim.lat, victim.lng],
                    [lat, lng]
                ]);
            } else {
                helperRoutes[id] = L.polyline([
                    [victim.lat, victim.lng],
                    [lat, lng]
                ], {
                    color: 'green',
                    weight: 4
                }).addTo(map);
            }

        });

    }, 2000);
}
console.log("Sos ID:", currentSOSId);