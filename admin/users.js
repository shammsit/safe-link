/* ================= AUTH CHECK ================= */

(function(){
    const isLoggedIn = localStorage.getItem("adminLoggedIn");

    if(!isLoggedIn){
        window.location.replace("/login.html");
    }

    // ❌ prevent back access
    window.history.pushState(null,null,location.href);
    window.onpopstate = () => {
        window.location.replace("/login.html");
    };
})();


/* ================= LOAD USERS ================= */

async function loadUsers(){

    const container = document.getElementById("usersList");

    try{
        const { data, error } = await supabaseClient
            .from("users")   // 👈 your users table
            .select("name,email,phone")
            .order("name", { ascending: true });

        if(error){
            console.error(error);
            return;
        }

        if(!data || data.length === 0){
            container.innerHTML = "<p>No users found</p>";
            return;
        }

        container.innerHTML = data.map(user => `
            <div class="user-card">
                <h3>${user.name}</h3>

                <p>🔒 ${maskData(user.email)}</p>
                <p>🔒 ${maskData(user.phone)}</p>
            </div>
        `).join("");

    }catch(err){
        console.error(err);
    }
}


/* ================= ENCRYPT / MASK ================= */

function maskData(value){
    if(!value) return "Hidden";

    const str = value.toString();

    if(str.length <= 4) return "****";

    return str.substring(0,2) + "****" + str.substring(str.length - 2);
}


/* ================= INIT ================= */
loadUsers();