/* ================= LOAD ADMIN ================= */

function loadAdmin(){

    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    const name = localStorage.getItem("adminName");
    const id = localStorage.getItem("adminId");

    const role = "Admin";

    // 🔒 STRICT PROTECTION
    if(!isLoggedIn || !name || !id){
        window.location.href = "/login.html";
        return;
    }

    // ✅ MAIN INFO
    document.getElementById("adminInfo").innerText =
        "Name: " + name + "\n" +
        "Role: " + role + "\n" +
        "Admin ID: " + id;

    // ✅ SIDEBAR DISPLAY
    document.getElementById("adminDisplay").innerText =
        "Logged in: " + name;

    // ✅ FOOTER MESSAGE
    document.getElementById("adminFooter").innerText =
        "Thank you " + name + " for maintaining platform integrity.\n" +
        "Your leadership keeps Safe Link secure and trusted.";
}

/* ================= SIDEBAR ================= */

function toggleSidebar(){
    document.getElementById("sidebar").classList.toggle("active");
}

function closeSidebar(){
    document.getElementById("sidebar").classList.remove("active");
}

/* ================= NAV ================= */

function goHome(){
    window.location.href = "/";
}

function goAbout(){
    window.location.href = "/about.html";
}

function goContact(){
    window.location.href = "https://techgen.online";
}

function goBack(){
    window.history.back();
}

/* ================= LOGOUT ================= */

function logoutAdmin(){

    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");

    window.location.href = "/login.html";
}

/* ================= INIT ================= */

loadAdmin();

window.onload = function(){
    document.getElementById("sidebar").classList.remove("active");
    loadAdmin();
};