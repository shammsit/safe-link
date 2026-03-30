// ================= SIMPLE MAP =================

window.onload = function(){

    const map = L.map('map').setView([22.5726, 88.3639], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
    }).addTo(map);
};