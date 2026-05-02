function shareSite(){

    const shareData = {
        title: "Safe Link – Your Safety Companion",
        text: "🚨 Stay Safe Anytime, Anywhere!\n\nSafe Link helps you connect quickly in emergencies, stay informed, and protect what matters most.\n\n👉 Try it now:",
        url: "https://safe-link.techgen.online/"
    };

    if(navigator.share){
        navigator.share(shareData);
    }else{
        // fallback for desktop
        const message = `${shareData.title}\n\n${shareData.text}\n${shareData.url}`;
        navigator.clipboard.writeText(message);
        alert("✅ Link copied! Share it with others.");
    }
}



function updateClock(){

    const timeEl = document.getElementById("liveTime");
    const dateEl = document.getElementById("liveDate");

    if(!timeEl || !dateEl) return; // 🛑 prevent crash

    const now = new Date();

    timeEl.innerText = now.toLocaleTimeString();
    dateEl.innerText = now.toDateString();
}

// run after page loads
window.addEventListener("DOMContentLoaded", () => {
    updateClock();
    setInterval(updateClock, 1000);
});


function handleEmergencyClick(){

    const userId = localStorage.getItem("userId");

    // ✅ LOGGED IN
    if(userId){
        window.location.href = "/emg_log/emergency.html";
    }
    // ❌ NOT LOGGED IN
    else{
        goEmg_all();
    }
}

async function initPermissions(){

    // 🔔 Ask Notification Permission
    const permission = await Notification.requestPermission();

    if(permission !== "granted"){
        alert("❌ Please allow notifications to receive alerts");
        return;
    }

    console.log("✅ Notification permission granted");

    // 📍 Ask Location Permission
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            pos => {
                console.log("✅ Location allowed");
                localStorage.setItem("lat", pos.coords.latitude);
                localStorage.setItem("lng", pos.coords.longitude);
            },
            err => {
                console.log("❌ Location denied");
            }
        );
    }
}

// 🔔 Show popup after 2 sec
window.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => {

        if(Notification.permission !== "granted"){
            document.getElementById("permissionBox").style.display = "block";
        }

    }, 2000);

});


// 🔔 Ask permission on button click
async function enableNotifications(){

    const permission = await Notification.requestPermission();

    if(permission === "granted"){

        alert("✅ Notifications enabled!");
        document.getElementById("permissionBox").style.display = "none";

        // 📍 Ask location
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(pos => {
                localStorage.setItem("lat", pos.coords.latitude);
                localStorage.setItem("lng", pos.coords.longitude);
            });
        }

        // 🔧 Register Service Worker (ONLY AFTER GRANTED)
        if("serviceWorker" in navigator){

            try{
                const reg = await navigator.serviceWorker.register("/sw.js");
                console.log("✅ Service Worker Registered");
            }catch(err){
                console.error("❌ SW Error:", err);
            }

        }

    } else {

        alert("❌ You blocked notifications.\nPlease allow from browser settings (🔒 icon)");

    }
}