/* ================= SECURITY ================= */

function forceLogout(){
    localStorage.clear();
    window.location.replace("/login.html"); // 🔒 prevents back
}


/* ================= LOAD ADMIN ================= */

async function loadAdminRole(){

    const adminId = localStorage.getItem("adminId");
    const field = document.getElementById("adminRoleField");

    if(!adminId || !field) return;

    try{

        const { data, error } = await supabaseClient
            .from("admins")
            .select("admin_role")
            .eq("admin_id", adminId)
            .single();

        if(error){
            console.error("Role fetch error:", error);
            field.value = "ADMIN";
            return;
        }

        field.value = data.admin_role.toUpperCase();

    }catch(err){
        console.error(err);
        field.value = "ADMIN";
    }
}

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

    window.location.replace("/login.html"); // 🔒 FIX
}


/* ================= INIT ================= */

window.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");

    if(sidebar){
        sidebar.classList.remove("active");
    }

    loadAdmin();
});


/* ================= BACK BUTTON BLOCK ================= */

window.addEventListener("pageshow", function(e){
    if(e.persisted){
        forceLogout();
    }
});


/* ================= SESSION CHECK ================= */

setInterval(() => {
    if(localStorage.getItem("adminLoggedIn") !== "true"){
        forceLogout();
    }
}, 2000);


/* ================= OUTSIDE CLICK CLOSE ================= */

document.addEventListener("click", (e) => {

    const sidebar = document.getElementById("sidebar");

    if(!sidebar) return;

    const isClickInside = sidebar.contains(e.target);
    const isMenuBtn = e.target.closest(".nav-btn");

    if(
        sidebar.classList.contains("active") &&
        !isClickInside &&
        !isMenuBtn
    ){
        sidebar.classList.remove("active");
    }
});


/* ================= ADMIN ACTION BUTTONS ================= */

function showUsers(){
    alert("Users panel coming soon");
}

function showFeedbacks(){
    alert("Feedback system coming soon");
}

function conductMeeting(){
    alert("Meeting system coming soon");
}

function sendNotice(){
    alert("Notice system coming soon");
}

function showMessages(){
    alert("User messages coming soon");
}

function showRatings(){
    alert("Ratings system coming soon");
}
function goUsers(){
    window.location.href = "/admin/users.html";
}

function goDashboard(){
    window.location.href = "/admin/dashboard.html";
}

function goNotice(){
    window.location.href = "/admin/create-notice.html";
}