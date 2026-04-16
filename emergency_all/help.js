let lat;
let lng;
let map;
let routeLine;
let userMarker;
let helpWatchID = null;
let helperID = null;

window.onload = function(){

    const params = new URLSearchParams(window.location.search);

    let sosId = params.get("sos_id"); // ✅ IMPORTANT
    lat = parseFloat(params.get("lat")) || 22.5726;
    lng = parseFloat(params.get("lng")) || 88.3639;

    map = L.map('map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    // 🔴 SOS marker
    const pulseIcon = L.divIcon({
        html: '<div class="sos-marker"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    L.marker([lat, lng], { icon: pulseIcon })
        .addTo(map)
        .bindPopup("🚨 SOS Location")
        .openPopup();

    if(navigator.geolocation){

        helpWatchID = navigator.geolocation.watchPosition(async (position) => {

            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // 🔵 Helper marker
            if(userMarker){
                map.removeLayer(userMarker);
            }

            userMarker = L.marker([userLat, userLng]).addTo(map)
                .bindPopup("📍 You are here");

            // ================= SEND LIVE =================
            try {

                const res = await fetch("https://api.ipify.org?format=json");
                const ipData = await res.json();
                const ip = ipData.ip;

                if (!helperID) {

                    const { data } = await supabaseClient
                        .from("help_responses")
                        .insert([{
                            sos_id: sosId,
                            helper_ip: ip,
                            latitude: userLat,
                            longitude: userLng
                        }])
                        .select()
                        .single();

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
};