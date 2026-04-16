let lat;
let lng;
let map;
let routeLine;
let userMarker;
let helpWatchID = null;
let helperID = null;

// ================= MAP WITH LOCATION =================
window.onload = function(){

    const params = new URLSearchParams(window.location.search);

    let sosId = params.get("sos_id"); // ✅ fixed name
    lat = parseFloat(params.get("lat")) || 22.5726;
    lng = parseFloat(params.get("lng")) || 88.3639;

    map = L.map('map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    // 🔴 SOS marker
    const pulseIcon = L.divIcon({
        className: '',
        html: '<div class="sos-marker"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    L.marker([lat, lng], { icon: pulseIcon })
        .addTo(map)
        .bindPopup("🚨 SOS Location")
        .openPopup();

    // ================= USER LIVE LOCATION =================
    if(navigator.geolocation){

        if (helpWatchID) {
            navigator.geolocation.clearWatch(helpWatchID);
        }

        helpWatchID = navigator.geolocation.watchPosition(async (position) => {

            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            const userIcon = L.divIcon({
                className: '',
                html: '<div class="user-marker"></div>',
                iconSize: [14,14],
                iconAnchor: [7,7]
            });

            if(userMarker){
                map.removeLayer(userMarker);
            }

            userMarker = L.marker([userLat, userLng], { icon: userIcon })
                .addTo(map)
                .bindPopup("📍 You are here");

            map.flyTo([userLat, userLng], 16);

            // 📏 Distance + Direction
            const result = getDistanceAndDirection(userLat, userLng, lat, lng);

            document.getElementById("routeInfo").innerHTML = `
                📏 Distance: ${result.distance.toFixed(2)} km<br>
                🧭 Direction: ${result.bearing.toFixed(0)}°
            `;

            // 🧭 Draw route
            drawRoute(userLat, userLng, lat, lng);

            // ================= SEND HELPER LIVE LOCATION =================
            try {

                const res = await fetch("https://api.ipify.org?format=json");
                const ipData = await res.json();
                const ip = ipData.ip;

                if (!helperID) {

                    const { data, error } = await supabaseClient
                        .from("help_responses")
                        .insert([{
                            sos_id: sosId,
                            helper_ip: ip,
                            latitude: userLat,
                            longitude: userLng
                        }])
                        .select()
                        .single();
                    if (error || !data) {
                        console.error(error);
                        return;
                    }
                    helperID = data.id;

                } else {

                    await supabaseClient
                        .from("help_responses")
                        .update({
                            latitude: userLat,
                            longitude: userLng
                        })
                        .eq("id", helperID);
                }

            } catch (err) {
                console.error(err);
            }

        }, console.error, {
            enableHighAccuracy: true
        });
    }
    console.log("SOS ID:", sosId);
};

// ================= ROUTE =================
async function drawRoute(userLat, userLng, sosLat, sosLng){

    const url = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${sosLng},${sosLat}?overview=full&geometries=geojson`;

    const res = await fetch(url);
    const data = await res.json();

    const coords = data.routes[0].geometry.coordinates;

    const latlngs = coords.map(c => [c[1], c[0]]);

    if(routeLine){
        map.removeLayer(routeLine);
    }

    routeLine = L.polyline(latlngs, {
        color: '#00bfff',
        weight: 5
    }).addTo(map);

    map.fitBounds(routeLine.getBounds());
}

// ================= DISTANCE + DIRECTION =================
function getDistanceAndDirection(lat1, lon1, lat2, lon2){

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI/180;
    const dLon = (lon2 - lon1) * Math.PI/180;

    const a =
        Math.sin(dLat/2)**2 +
        Math.cos(lat1*Math.PI/180) *
        Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2)**2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    const y = Math.sin(dLon) * Math.cos(lat2*Math.PI/180);
    const x =
        Math.cos(lat1*Math.PI/180) * Math.sin(lat2*Math.PI/180) -
        Math.sin(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.cos(dLon);

    const bearing = (Math.atan2(y, x) * 180/Math.PI + 360) % 360;

    return { distance, bearing };
}
