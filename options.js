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
        smoothRedirect("/index.html");
    }
}

function goAbout(){
    smoothRedirect("/about.html");
}

function goNotices(){
    if(window.location.pathname.includes("/dashboard/")){
        smoothRedirect("../notice/notice.html");
    } else {
        smoothRedirect("/notice/notice.html");
    }
}

function goLogin(){
    if(window.location.pathname.includes("/dashboard/")){
        smoothRedirect("../login.html");
    } else {
        smoothRedirect("/login.html");
    }
}

function goProfile(){
    if(window.location.pathname.includes("/dashboard/")){
        smoothRedirect("../profile.html");
    } else {
        smoothRedirect("/dashboard/profile.html");
    }
}

function goDashboard(){
    if(window.location.pathname.includes("/dashboard/")){
        smoothRedirect("/dashboard.html");
    } else {
        smoothRedirect("/dashboard/dashboard.html");
    }
}

function goEmergency(){
    if(window.location.pathname.includes("/dashboard/")){
        smoothRedirect("/emergency.html");
    } else {
        smoothRedirect("dashboard/emergency.html");
    }
}

/* ================= CONTACT ================= */

function goContact(){
    if(window.location.pathname.includes("/dashboard/")){
        smoothRedirect("../contact.html");
    } else {
        smoothRedirect("/contact.html");
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

/* ================= AUTH UI CONTROL ================= */

/* ================= AUTH UI CONTROL (FINAL) ================= */

async function handleAuthUI(){

    if(typeof supabaseClient === "undefined") return;

    const { data: { session } } = await supabaseClient.auth.getSession();
    const isLoggedIn = !!session;

    const loginBtn = document.querySelector(".side-btn-login");
    const logoutBtn = document.querySelector(".side-btn-logout");
    const dashboardBtn = document.querySelector(".side-btn-dashboard");
    const profileBtn = document.getElementById("profileBtn");

    const allSideBtns = document.querySelectorAll(".side-btn");
    const navBtns = document.querySelectorAll(".nav-btn");

    let settingsBtn = null;
    let emergencyAlertBtn = null;
    let emergencyNoLoginBtn = null;

    allSideBtns.forEach(btn=>{
        const text = btn.innerText.toLowerCase();

        if(text.includes("settings")) settingsBtn = btn;
        if(text.includes("emergency alert")) emergencyAlertBtn = btn;
        if(text.includes("without login")) emergencyNoLoginBtn = btn;
    });

    let settingsIcon = null;
    const headerProfileBtn = document.getElementById("headerProfileBtn");

    navBtns.forEach(btn=>{
        if(btn.innerText.includes("⚙")) settingsIcon = btn;
    });

    /* ================= LOGGED IN ================= */
    if(isLoggedIn){

        if(loginBtn) loginBtn.style.display = "none";
        if(logoutBtn) logoutBtn.style.display = "block";
        if(dashboardBtn) dashboardBtn.style.display = "block";
        if(profileBtn) profileBtn.style.display = "block";

        if(emergencyNoLoginBtn) emergencyNoLoginBtn.style.display = "none";

        if(settingsBtn) settingsBtn.style.display = "block";
        if(settingsIcon) settingsIcon.style.display = "inline-block";

        if(headerProfileBtn) headerProfileBtn.onclick = goProfile;
    }

    /* ================= NOT LOGGED IN ================= */
    else{

        if(loginBtn) loginBtn.style.display = "block";
        if(logoutBtn) logoutBtn.style.display = "none";

        // ❌ HIDE THESE
        if(dashboardBtn) dashboardBtn.style.display = "none";
        if(profileBtn) profileBtn.style.display = "none";
        if(settingsBtn) settingsBtn.style.display = "none";
        if(settingsIcon) settingsIcon.style.display = "none";

        // ❌ hide emergency alert
        if(emergencyAlertBtn) emergencyAlertBtn.style.display = "none";

        // ✔ keep this visible
        if(emergencyNoLoginBtn) emergencyNoLoginBtn.style.display = "block";

        if(headerProfileBtn){
            headerProfileBtn.onclick = goLogin;
        }
    }
}

handleAuthUI();

/* ================= LOGOUT ================= */

async function logoutUser(){
    try{
        if(typeof supabaseClient !== "undefined"){
            await supabaseClient.auth.signOut();
        }
    }catch(e){}

    if(window.location.pathname.includes("/dashboard/")){
        window.location.href = "../index.html";
    } else {
        window.location.href = "/index.html";
    }
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
}

function goEmg_all(){
    window.location.href = window.location.origin + "/emergency_all/emergency.html";
}