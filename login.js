function showLogin(){
    document.getElementById("loginBlock").style.display = "block";
    document.getElementById("signupBlock").style.display = "none";
}

function showSignup(){
    document.getElementById("loginBlock").style.display = "none";
    document.getElementById("signupBlock").style.display = "block";
}

let loginCaptcha="";
let signupCaptcha="";

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
            window.location.href="../dashboard.html";
        },1000);
    }
}