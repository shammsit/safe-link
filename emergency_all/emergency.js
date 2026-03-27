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

window.onload = function(){

    const map = L.map('map').setView([22.5726, 88.3639], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
    }).addTo(map);

};

function scrollBelowMap(){
    const target = document.querySelector('.emergency-box');
    if(target){
        target.scrollIntoView({
            behavior: 'smooth'
        });
    }else{
            console.log("Target element not found for scrolling.");
        }
        //alert("clicked");
}