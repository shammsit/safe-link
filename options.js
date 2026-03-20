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

/* ================= CONTACT ================= */

function goContact(){
    if(window.location.pathname.includes("/dashboard/")){
        smoothRedirect("../contact.html");
    } else {
        smoothRedirect("contact.html");
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

async function handleAuthUI(){

    if(typeof supabaseClient === "undefined") return;

    const { data: { session } } = await supabaseClient.auth.getSession();

    const isLoggedIn = !!session;

    // Sidebar elements
    const loginBtn = document.querySelector(".side-btn-login");
    const logoutBtn = document.querySelector(".side-btn-logout");
    const dashboardBtn = document.querySelector(".side-btn-dashboard");
    const profileBtn = document.getElementById("profileBtn");

    // Other sidebar buttons (by text match)
    const allButtons = document.querySelectorAll(".side-btn");

    let emergencyNoLoginBtn = null;
    let settingsBtn = null;
    let contactBtn = null;

    allButtons.forEach(btn=>{
        const text = btn.innerText.toLowerCase();

        if(text.includes("without login")) emergencyNoLoginBtn = btn;
        if(text.includes("settings")) settingsBtn = btn;
        if(text.includes("contact")) contactBtn = btn;
    });

    // Header elements
    const headerProfileBtn = document.getElementById("headerProfileBtn");
    const navBtns = document.querySelectorAll(".nav-btn");

    let callBtn = null;
    let settingsIcon = null;

    navBtns.forEach(btn=>{
        if(btn.innerText.includes("📞")) callBtn = btn;
        if(btn.innerText.includes("⚙")) settingsIcon = btn;
    });

    /* ================= WHEN LOGGED IN ================= */
    if(isLoggedIn){

        if(loginBtn) loginBtn.style.display = "none";
        if(logoutBtn) logoutBtn.style.display = "block";
        if(dashboardBtn) dashboardBtn.style.display = "block";

        if(emergencyNoLoginBtn) emergencyNoLoginBtn.style.display = "none";

        if(profileBtn) profileBtn.onclick = goProfile;
        if(headerProfileBtn) headerProfileBtn.onclick = goProfile;

    }

    /* ================= WHEN NOT LOGGED IN ================= */
    else{

        if(loginBtn) loginBtn.style.display = "block";
        if(logoutBtn) logoutBtn.style.display = "none";
        if(dashboardBtn) dashboardBtn.style.display = "none";

        if(profileBtn) profileBtn.style.display = "none";
        if(settingsBtn) settingsBtn.style.display = "none";

        if(settingsIcon) settingsIcon.style.display = "none";

        if(headerProfileBtn){
            headerProfileBtn.onclick = goLogin;
        }

        // Hide emergency alert button (sidebar)
        allButtons.forEach(btn=>{
            if(btn.innerText.toLowerCase().includes("emergency alert")){
                btn.style.display = "none";
            }
        });
    }

    /* ================= CONTACT REDIRECT ================= */

    if(contactBtn){
        contactBtn.onclick = goContact;
    }

    if(callBtn){
        callBtn.onclick = goContact;
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
        window.location.href = "index.html";
    }
}