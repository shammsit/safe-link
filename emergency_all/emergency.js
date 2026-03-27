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