function setActive(tab){
    document.getElementById("loginTab").classList.remove("active");
    document.getElementById("signupTab").classList.remove("active");
    document.getElementById("adminTab").classList.remove("active");

    tab.classList.add("active");
}

function showLogin(){
    document.getElementById("loginBlock").style.display = "block";
    document.getElementById("signupBlock").style.display = "none";
    document.getElementById("adminBlock").style.display = "none";
    setActive(document.getElementById("loginTab"));
}

function showSignup(){
    document.getElementById("loginBlock").style.display = "none";
    document.getElementById("signupBlock").style.display = "block";
    document.getElementById("adminBlock").style.display = "none";
    setActive(document.getElementById("signupTab"));
}

function showAdmin(){
    document.getElementById("loginBlock").style.display = "none";
    document.getElementById("signupBlock").style.display = "none";
    document.getElementById("adminBlock").style.display = "block";
    setActive(document.getElementById("adminTab"));
}

let loginCaptcha="";
let signupCaptcha="";
let adminCaptcha = "";

function generateAdminCaptcha(){
    adminCaptcha = generateCaptcha();
    document.getElementById("adminCaptchaText").innerText = adminCaptcha;
}
function generateCaptcha(){
    return Math.random().toString(36).substring(2,7).toUpperCase();
}

function generateLoginCaptcha(){
    loginCaptcha = generateCaptcha();
    document.getElementById("loginCaptchaText").innerText = loginCaptcha;
}

function generateSignupCaptcha(){
    signupCaptcha = generateCaptcha();
    document.getElementById("signupCaptchaText").innerText = signupCaptcha;
}

window.onload = function(){
    generateLoginCaptcha();
    generateSignupCaptcha();
    generateAdminCaptcha();
};

async function signup(){

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const captchaInput = document.getElementById("signupCaptchaInput").value;
    const msg = document.getElementById("authMsg");
    const btn = document.querySelector("#signupBlock .auth-btn");

    if(captchaInput !== signupCaptcha){
        msg.innerText = "❌ Invalid CAPTCHA";
        return;
    }

    // 🔄 LOADING START
    btn.innerText = "Processing...";
    btn.disabled = true;

    const { error } = await supabaseClient.auth.signUp({
        email,
        password
    });

    if(error){
        msg.innerText = "❌ " + error.message;

        btn.innerText = "Create Account";
        btn.disabled = false;
    }else{
        msg.innerText = "✅ Signup successful!";

        btn.innerText = "Create Account";
        btn.disabled = false;
    }
}

async function login(){

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const captchaInput = document.getElementById("loginCaptchaInput").value;
    const msg = document.getElementById("authMsg");
    const btn = document.querySelector("#loginBlock .auth-btn");

    if(captchaInput !== loginCaptcha){
        msg.innerText = "❌ Invalid CAPTCHA";
        return;
    }

    // 🔄 LOADING START
    btn.innerText = "Processing...";
    btn.disabled = true;

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if(error){
        msg.innerText = "❌ " + error.message;

        btn.innerText = "Login";
        btn.disabled = false;
    }else{
        msg.innerText = "✅ Login successful";

        setTimeout(()=>{
            window.location.href="/dashboard/dashboard.html";
        },1000);
    }
}

async function adminLogin(){

    const adminId = document.getElementById("adminUser").value;
    const password = document.getElementById("adminPass").value;
    const captchaInput = document.getElementById("adminCaptchaInput").value;
    const msg = document.getElementById("authMsg");
    const btn = document.querySelector("#adminBlock .admin-btn");

    if(captchaInput !== adminCaptcha){
        msg.innerText = "❌ Invalid CAPTCHA";
        return;
    }

    btn.innerText = "Verifying...";
    btn.disabled = true;

    try{

        const { data, error } = await supabaseClient
            .from("admins")
            .select("*")
            .eq("admin_id", adminId)
            .eq("password", password);

        if(error){
            console.error(error);
        }

        if(!data || data.length === 0){
            msg.innerText = "❌ Invalid Admin ID or Password";
            btn.innerText = "Enter Admin Panel";
            btn.disabled = false;
            return;
        }

        const admin = data[0];

        msg.innerText = "✅ Admin Login Successful";

        // ✅ IMPORTANT FIX
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminId", admin.admin_id); // UUID ✅
        localStorage.setItem("adminRole", admin.admin_role || "ADMIN");
        localStorage.setItem("adminName", admin.admin_name);

        setTimeout(()=>{
            window.location.href = "/admin/dashboard.html";
        },1000);

    }catch(err){
        console.error(err);
        msg.innerText = "❌ Something went wrong";
        btn.innerText = "Enter Admin Panel";
        btn.disabled = false;
    }
}