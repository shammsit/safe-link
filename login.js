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

    if(captchaInput !== signupCaptcha){
        msg.innerText = "❌ Invalid CAPTCHA";
        return;
    }

    const { error } = await supabaseClient.auth.signUp({
        email,
        password
    });

    if(error){
        msg.innerText = "❌ " + error.message;
    }else{
        msg.innerText = "✅ Signup successful!";
    }
}

async function login(){

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const captchaInput = document.getElementById("loginCaptchaInput").value;
    const msg = document.getElementById("authMsg");

    if(captchaInput !== loginCaptcha){
        msg.innerText = "❌ Invalid CAPTCHA";
        return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if(error){
        msg.innerText = "❌ " + error.message;
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

    // CAPTCHA check
    if(captchaInput !== adminCaptcha){
        msg.innerText = "❌ Invalid CAPTCHA";
        return;
    }

    try{

        const { data, error } = await supabaseClient
            .from("admins")
            .select("*")
            .eq("admin_id", adminId)
            .eq("password", password)
            .single();

        if(error || !data){
            msg.innerText = "❌ Invalid Admin ID or Password";
            return;
        }

        // ✅ SUCCESS
        msg.innerText = "✅ Admin Login Successful";

        // Save admin session (IMPORTANT)
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminId", data.admin_id);
        localStorage.setItem("adminName", data.admin_name);

        setTimeout(()=>{
            window.location.href = "/admin/dashboard.html";
        },1000);

    }catch(err){
        msg.innerText = "❌ Something went wrong";
        console.error(err);
    }
}