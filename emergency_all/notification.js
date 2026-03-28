const list = document.getElementById("notificationList");

// 📥 Load notifications from DB
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

        card.innerHTML = `
            <div class="msg">🚨 ${item.message}</div>
            <div class="time">🕒 ${new Date(item.created_at).toLocaleString()}</div>
            <div class="time">📍 ${item.latitude}, ${item.longitude}</div>
        `;

        list.appendChild(card);
    });
}

// 🔄 Auto refresh every 5 seconds
setInterval(loadNotifications, 5000);

// 🚀 First load
loadNotifications();