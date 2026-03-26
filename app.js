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

let visits = localStorage.getItem("siteVisits") || 0;
visits++;
localStorage.setItem("siteVisits", visits);

document.getElementById("visitCount").innerText = "👁 " + visits;




function updateDays(){

    const startDate = new Date("2026-01-01");
    const today = new Date();

    const diff = today - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    document.getElementById("daysCount").innerText = "📅 " + days + " days";
}

updateDays();




function updateClock(){

    const now = new Date();

    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    document.getElementById("liveTime").innerText = time;
    document.getElementById("liveDate").innerText = date;
}

setInterval(updateClock, 1000);
updateClock();