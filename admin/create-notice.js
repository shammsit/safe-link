// ================= ADMIN AUTH PROTECTION =================
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


// ================= LOAD USERS =================
async function loadUsers(){

    const select = document.getElementById("userSelect");

    if(!select) return;

    try{

        const { data, error } = await supabaseClient
            .from("profiles")
            .select("id, name");

        if(error){
            console.error("Fetch error:", error);
            select.innerHTML = "<option>Error loading users</option>";
            return;
        }

        if(!data || data.length === 0){
            select.innerHTML = "<option>No users found</option>";
            return;
        }

        select.innerHTML = "";

        data.forEach(user => {
            const option = document.createElement("option");
            option.value = user.id;
            option.textContent = user.name;
            select.appendChild(option);
        });

    }catch(err){
        console.error(err);
    }
}


// ================= LOAD ADMIN ROLE =================
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
            console.error(error);
            field.value = "ADMIN";
            return;
        }

        field.value = data.admin_role.toUpperCase();

    }catch(err){
        console.error(err);
        field.value = "ADMIN";
    }
}


// ================= INIT (MERGED FIX) =================
document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    if(sidebar) sidebar.classList.remove("active");

    loadUsers();        // ✅ users dropdown
    loadAdminRole();    // ✅ admin role

});


// ================= OUTSIDE CLICK CLOSE =================
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

// ================= TOGGLE USER SELECT =================
function handleTargetChange(){

    const selected = document.querySelector('input[name="target"]:checked');
    const userGroup = document.getElementById("userSelectGroup");

    if(!selected || !userGroup) return;

    if(selected.value === "specific"){
        userGroup.style.display = "block";   // ✅ show
    }else{
        userGroup.style.display = "none";    // ✅ hide
    }
}


// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

    const radios = document.querySelectorAll('input[name="target"]');

    radios.forEach(radio => {
        radio.addEventListener("change", handleTargetChange);
    });

    handleTargetChange(); // ✅ run on load

});

document.addEventListener("DOMContentLoaded", () => {

    const select = document.getElementById("userSelect");

    if(!select) return;

    select.addEventListener("mousedown", function(e){
        e.preventDefault();

        const option = e.target;

        if(option.tagName === "OPTION"){
            option.selected = !option.selected; // toggle selection
        }
    });

});

async function postNotice(){

    try{

        const subject = document.querySelector("input[type='text']").value;
        const content = document.querySelector("textarea").value;

        const postDate = document.querySelectorAll("input[type='date']")[0].value;
        const expiryDate = document.querySelectorAll("input[type='date']")[1].value;

        const urgent = document.querySelector("input[type='checkbox'][id='urgentCheck']")?.checked || false;

        const admin = document.getElementById("adminRoleField").value;

        // ✅ TARGET SELECTION (radio)
        const target = document.querySelector("input[name='target']:checked")?.value;

        let userIds = [];

        if(target === "specific"){
            const select = document.getElementById("userSelect");

            userIds = Array.from(select.selectedOptions).map(opt => opt.value);
        }

        // ❌ attachment not uploaded yet → keep null
        const attachment_url = null;

        const { data, error } = await supabaseClient
            .from("notices")
            .insert([{
                subject,
                content,
                post_date: postDate,
                expiry_date: expiryDate || null,
                urgent,
                is_urgent: urgent,
                created_by: admin,
                target: target,
                target_type: target,
                user_ids: userIds.length ? userIds : null,
                target_users: userIds.length ? userIds : null,
                attachment_url
            }]);

        if(error){
            console.error(error);
            alert("Error posting notice");
            return;
        }

        alert("✅ Notice Posted Successfully");

        location.reload();

    }catch(err){
        console.error(err);
    }
}