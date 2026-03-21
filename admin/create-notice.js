// ✅ ADMIN AUTH PROTECTION (same logic)

(function(){

    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    const id = localStorage.getItem("adminId");

    if(!isLoggedIn || !id){
        window.location.replace("/login.html");
    }

})();


// ================= SIDEBAR =================
function toggleSidebar(){
    const sidebar = document.getElementById("sidebar");
    if(sidebar) sidebar.classList.toggle("active");
}

function closeSidebar(){
    const sidebar = document.getElementById("sidebar");
    if(sidebar) sidebar.classList.remove("active");
}


// ================= NAV =================
function goHome(){
    window.location.href = "/";
}

function goDashboard(){
    window.location.href = "/admin/dashboard.html";
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


// ================= LOGOUT =================
function logoutAdmin(){

    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");

    window.location.replace("/login.html");
}


// ================= INIT =================
window.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    if(sidebar) sidebar.classList.remove("active");
});