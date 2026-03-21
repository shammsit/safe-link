/* ================= LOAD ADMIN ================= */

async function loadAdmin(){

    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    const id = localStorage.getItem("adminId");
    const name = localStorage.getItem("adminName");

    if(!isLoggedIn || !id){
        window.location.href = "/login.html";
        return;
    }

    try{
        const { data, error } = await supabaseClient
            .from("admins")
            .select("admin_role")
            .eq("admin_id", id)
            .single();

        if(error){
            console.error(error);
            return;
        }

        const role = data?.admin_role || "Administrator";

        // ✅ PROFESSIONAL RUNNING TEXT
        const adminInfo = document.getElementById("adminInfo");
        if(adminInfo){
            adminInfo.innerHTML = `
                <div class="admin-marquee">
                    Welcome ${name} &nbsp;|&nbsp; ${role.toUpperCase()} &nbsp;|&nbsp; ${id}
                </div>
            `;
        }

        // ✅ SIDEBAR NAME
        const adminDisplay = document.getElementById("adminDisplay");
        if(adminDisplay){
            adminDisplay.innerText = "Logged in: " + name;
        }

        // ✅ FOOTER MESSAGE
        const adminFooter = document.getElementById("adminFooter");
        if(adminFooter){
            adminFooter.innerText =
                "Respected " + name +
                ", your leadership ensures the safety, reliability, and trust of the Safe Link platform.";
        }

    }catch(err){
        console.error("Admin Load Error:", err);
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

    window.location.href = "/login.html";
}


/* ================= INIT ================= */

window.addEventListener("DOMContentLoaded", function(){

    const sidebar = document.getElementById("sidebar");
    if(sidebar){
        sidebar.classList.remove("active"); // ✅ fix partial open bug
    }

    loadAdmin();
});


/* ================= OUTSIDE CLICK CLOSE ================= */

document.addEventListener("click", function(e){

    const sidebar = document.getElementById("sidebar");

    if(!sidebar) return;

    const isClickInside = sidebar.contains(e.target);
    const isMenuBtn = e.target.closest(".nav-btn");

    if(sidebar.classList.contains("active") && !isClickInside && !isMenuBtn){
        sidebar.classList.remove("active");
    }
});

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