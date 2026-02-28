// ================= SIDEBAR =================

function toggleSidebar(){
    const sidebar = document.getElementById("sidebar");
    if(sidebar){
        sidebar.classList.toggle("active");
    }
}

function closeSidebar(){
    const sidebar = document.getElementById("sidebar");
    if(sidebar){
        sidebar.classList.remove("active");
    }
}

// ================= SMOOTH REDIRECT =================

function smoothRedirect(page){
    document.body.style.opacity = 0;
    setTimeout(()=>{
        window.location.href = page;
    },300);
}

function goHome(){
    if(window.location.pathname.includes("/dashboard/")){
        smoothRedirect("../index.html");
    } else {
        smoothRedirect("index.html");
    }
}

function goLogin(){
    if(window.location.pathname.includes("/dashboard/")){
        smoothRedirect("../login.html");
    } else {
        smoothRedirect("login.html");
    }
}
function goProfile(){
    if(window.location.pathname.includes("/dashboard/")){
        smoothRedirect("profile.html");
    } else {
        smoothRedirect("dashboard/profile.html");
    }
}
function goDashboard(){
    if(window.location.pathname.includes("/dashboard/")){
        smoothRedirect("dashboard.html");
    } else {
        smoothRedirect("dashboard/dashboard.html");
    }
}

function goBack(){
    if(window.history.length > 1){
        window.history.back();
    } else {
        goHome();
    }
}

// ================= DONATION (ALWAYS ACTIVE) =================

function openDonation(){
    window.open("https://razorpay.me/@digirock", "_blank");
}

// ================= DOM READY =================

document.addEventListener("DOMContentLoaded", function(){

    if (typeof firebase === "undefined" || !firebase.apps.length) {
        console.log("Firebase not ready yet.");
        return;
    }

    const auth = firebase.auth();

    auth.onAuthStateChanged(function(user){

        const loginBtn = document.querySelector(".side-btn-login");
        const logoutBtn = document.querySelector(".side-btn-logout");
        const dashboardBtn = document.querySelector(".side-btn-dashboard");
        const emailDisplay = document.getElementById("userEmailDisplay");
        const profileBtn = document.getElementById("profileBtn");
        const headerProfileBtn = document.getElementById("headerProfileBtn");

        if(user){

            if(loginBtn) loginBtn.style.display = "none";
            if(logoutBtn) logoutBtn.style.display = "block";
            if(dashboardBtn) dashboardBtn.style.display = "block";

            if(emailDisplay){
                emailDisplay.innerText = "Logged in: " + user.email;
            }

            if(profileBtn){
                profileBtn.onclick = goProfile;
            }

            if(headerProfileBtn){
                headerProfileBtn.onclick = goProfile;
            }

        } else {

            if(loginBtn) loginBtn.style.display = "block";
            if(logoutBtn) logoutBtn.style.display = "none";
            if(dashboardBtn) dashboardBtn.style.display = "none";

            if(emailDisplay){
                emailDisplay.innerText = "";
            }

            if(profileBtn){
                profileBtn.onclick = null;
            }

            if(headerProfileBtn){
                headerProfileBtn.onclick = null;
            }
        }

    });

});

// ================= LOGOUT =================

function logoutUser(){

    firebase.auth().signOut().then(()=>{

        if(window.location.pathname.includes("/dashboard/")){
            window.location.href = "../index.html";
        } else {
            window.location.href = "index.html";
        }

    });

}

// ================= SAFE LOADER (NO AUDIO CRASH) =================

window.addEventListener("load", function(){

    const loader = document.getElementById("loader");
    const sound = document.getElementById("heartbeatSound");

    if(sound){
        sound.play().catch(()=>{});  // ✅ prevents autoplay crash
    }

    if(loader){
        setTimeout(()=>{
            loader.style.display="none";
            if(sound){
                try{
                    sound.pause();
                    sound.currentTime = 0;
                }catch(e){}
            }
        },1200);
    }

});

function goEmergency(){
    if(window.location.pathname.includes("/dashboard/")){
        smoothRedirect("emergency.html");
    } else {
        smoothRedirect("dashboard/emergency.html");
    }
}