/* ================= SIDEBAR ================= */
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

/* ================= SMOOTH REDIRECT ================= */

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

function goAbout(){
    smoothRedirect("/about.html");
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

function goEmergency(){
    if(window.location.pathname.includes("/dashboard/")){
        smoothRedirect("emergency.html");
    } else {
        smoothRedirect("dashboard/emergency.html");
    }
}

/* ================= BACK ================= */

function goBack(){
    if(window.history.length > 1){
        window.history.back();
    } else {
        goHome();
    }
}

/* ================= DONATION ================= */

function openDonation(){
    window.open("https://razorpay.me/@digirock", "_blank");
}

/* ================= LOADER ================= */

window.addEventListener("load", function(){

    const loader = document.getElementById("loader");
    const sound = document.getElementById("heartbeatSound");

    if(sound){
        sound.play().catch(()=>{});
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

/* ================= LOGOUT (SUPABASE READY) ================= */

async function logoutUser(){

    try{
        if(typeof supabase !== "undefined"){
            await supabase.auth.signOut();
        }
    }catch(e){}

    if(window.location.pathname.includes("/dashboard/")){
        window.location.href = "../index.html";
    } else {
        window.location.href = "index.html";
    }
}