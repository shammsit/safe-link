/* ================= UI TOGGLE ================= */

function showLogin(){
    document.getElementById("loginBlock").style.display = "block";
    document.getElementById("signupBlock").style.display = "none";
}

function showSignup(){
    document.getElementById("loginBlock").style.display = "none";
    document.getElementById("signupBlock").style.display = "block";
}

/* ================= CAPTCHA ================= */

let loginCaptcha = "";
let signupCaptcha = "";

function generateCaptcha(){
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

function generateLoginCaptcha(){
    loginCaptcha = generateCaptcha();
    document.getElementById("loginCaptchaText").innerText = loginCaptcha;
}

function generateSignupCaptcha(){
    signupCaptcha = generateCaptcha();
    document.getElementById("signupCaptchaText").innerText = signupCaptcha;
}

// Generate on load
window.onload = function(){
    generateLoginCaptcha();
    generateSignupCaptcha();
};

/* ================= SIGNUP ================= */

async function signup(){

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const captchaInput = document.getElementById("signupCaptchaInput").value;

    const msg = document.getElementById("authMsg");

    if(captchaInput !== signupCaptcha){
        console.error(err);
        msg.innerText = "❌ Invalid CAPTCHA" + err.message;
        return;
    }

    if(password.length < 6){
        msg.innerText = "❌ Password must be at least 6 characters";
        return;
    }

    try{
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if(error){
            msg.innerText = "❌ " + error.message;
        }else{
            msg.innerText = "✅ Signup successful! Check your email.";
        }

    }catch(err){
        msg.innerText = "❌ Something went wrong";
    }
}

/* ================= LOGIN ================= */

async function login(){

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const captchaInput = document.getElementById("loginCaptchaInput").value;

    const msg = document.getElementById("authMsg");

    if(captchaInput !== loginCaptcha){
        msg.innerText = "❌ Invalid CAPTCHA";
        return;
    }

    try{
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if(error){
            msg.innerText = "❌ " + error.message;
        }else{
            msg.innerText = "✅ Login successful";

            // redirect after login
            setTimeout(()=>{
                window.location.href = "dashboard.html";
            },1000);
        }

    }catch(err){
        msg.innerText = "❌ Login failed";
    }
}

/* ================= RESET PASSWORD ================= */

async function resetPassword(){

    const email = document.getElementById("loginEmail").value;
    const msg = document.getElementById("authMsg");

    if(!email){
        msg.innerText = "❌ Enter your email first";
        return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if(error){
        msg.innerText = "❌ " + error.message;
    }else{
        msg.innerText = "✅ Password reset email sent";
    }
}