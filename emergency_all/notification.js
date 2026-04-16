const list = document.getElementById("notificationList");

// 📏 Calculate distance
function getDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

// USER LOCATION
let userLat = null;
let userLng = null;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
        userLat = pos.coords.latitude;
        userLng = pos.coords.longitude;
    });
}

// LOAD DATA
async function loadNotifications(){

    const { data, error } = await supabaseClient
        .from("sos_alerts")
        .select("*")
        .order("created_at", { ascending: false });

    if(error){
        console.error("Fetch Error:", error);
        return;
    }

    list.innerHTML = "";

    if(data.length === 0){
        list.innerHTML = "<p style='color:#aaa'>No alerts yet</p>";
        return;
    }

    data.forEach(item => {

        const card = document.createElement("div");
        card.className = "notification-card";

        let distanceText = "📏 Calculating...";
        let circleClass = "circle-normal";

        if(userLat !== null && userLng !== null){

            const dist = getDistance(userLat, userLng, item.latitude, item.longitude);

            distanceText = dist < 1
                ? `📏 ${(dist * 1000).toFixed(0)} meters away`
                : `📏 ${dist.toFixed(2)} km away`;

            if(dist <= 1){
                circleClass = "circle-danger";
            }
            else if(dist <= 3){
                circleClass = "circle-warning";
            }
            else if(dist <= 10){
                circleClass = "circle-light";
            }
        }

        card.innerHTML = `
            <div class="msg">🚨 ${item.message}</div>
            <div class="time">🕒 ${new Date(item.created_at).toLocaleString()}</div>
            <div class="time">📍 ${item.latitude}, ${item.longitude}</div>
            <div class="time">${distanceText}</div>

            <div class="btn-group">
                <button class="help-btn" onclick="openHelpPage(${item.latitude}, ${item.longitude})">Help</button>
                <button class="sorry-btn" onclick="sendSorry()">Sorry</button>
            </div>

            <div class="alert-circle ${circleClass}">🚨</div>
        `;

        list.appendChild(card);
    });
}

// AUTO REFRESH
setInterval(loadNotifications, 5000);
loadNotifications();

function openHelpPage(lat, lng, sos_id){
    window.location.href = `help.html?lat=${lat}&lng=${lng}&sos_id=${sos_id}`;
}

function sendSorry(){
    alert("🙏 Sorry! Unable to help right now.");
}