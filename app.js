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
