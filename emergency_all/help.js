// ================= MAP WITH LOCATION =================

window.onload = function(){

    // 📍 Get lat & lng from URL
    const params = new URLSearchParams(window.location.search);

    const lat = parseFloat(params.get("lat")) || 22.5726;
    const lng = parseFloat(params.get("lng")) || 88.3639;

    // 🗺 Create map
    const map = L.map('map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    // 📍 Add marker
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
};