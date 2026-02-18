let loginCaptcha = "";
let signupCaptcha = "";
let failedAttempts = 0;
let lockUntil = null;

document.addEventListener("DOMContentLoaded", function(){
    generateLoginCaptcha();
    generateSignupCaptcha();
    setupStrengthMeter();
    monitorAuthState();
});

/* ================= TOGGLE ================= */

function showLogin(){
    document.getElementById("loginBlock").style.display="block";
    document.getElementById("signupBlock").style.display="none";
}

function showSignup(){
    document.getElementById("loginBlock").style.display="none";
    document.getElementById("signupBlock").style.display="block";
}

/* ================= LOGIN CAPTCHA ================= */

function generateLoginCaptcha(){
    const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    loginCaptcha="";
    for(let i=0;i<6;i++){
        loginCaptcha+=chars[Math.floor(Math.random()*chars.length)];
    }
    document.getElementById("loginCaptchaText").innerText=loginCaptcha;
}

function loginCaptchaValid(){
    return document.getElementById("loginCaptchaInput").value===loginCaptcha;
}

/* ================= SIGNUP CAPTCHA ================= */

function generateSignupCaptcha(){
    const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    signupCaptcha="";
    for(let i=0;i<6;i++){
        signupCaptcha+=chars[Math.floor(Math.random()*chars.length)];
    }
    document.getElementById("signupCaptchaText").innerText=signupCaptcha;
}

function signupCaptchaValid(){
    return document.getElementById("signupCaptchaInput").value===signupCaptcha;
}

/* ================= PASSWORD STRENGTH ================= */

function setupStrengthMeter(){
    const input=document.getElementById("signupPassword");
    if(!input) return;

    input.addEventListener("input",function(){
        const val=this.value;
        const bar=document.getElementById("strengthBar");

        let strength=0;
        if(val.length>6) strength+=25;
        if(/[A-Z]/.test(val)) strength+=25;
        if(/[0-9]/.test(val)) strength+=25;
        if(/[^A-Za-z0-9]/.test(val)) strength+=25;

        bar.style.width=strength+"%";

        if(strength<=25) bar.style.background="red";
        else if(strength<=50) bar.style.background="orange";
        else if(strength<=75) bar.style.background="yellow";
        else bar.style.background="green";
    });
}

/* ================= LOCK SYSTEM ================= */

function isLocked(){
    if(lockUntil && Date.now()<lockUntil){
        showMsg("Too many failed attempts. Try again later.");
        return true;
    }
    return false;
}

/* ================= LOGIN ================= */

function login(){

    if(isLocked()) return;

    if(!loginCaptchaValid()){
        showMsg("Invalid CAPTCHA.");
        generateLoginCaptcha();
        return;
    }

    const email=document.getElementById("loginEmail").value;
    const pass=document.getElementById("loginPassword").value;

    // 🔥 SHOW LOADER
    document.getElementById("loader").style.display="flex";

    auth.signInWithEmailAndPassword(email,pass)
    .then(userCred=>{

        if(!userCred.user.emailVerified){
            document.getElementById("loader").style.display="none";
            showMsg("Please verify your email first.");
            return;
        }

        window.location.href="dashboard/dashboard.html";

    })
    .catch(err=>{
        document.getElementById("loader").style.display="none";
        showMsg(formatError(err));
    });
}

/* ================= SIGNUP ================= */

function signup(){

    if(!signupCaptchaValid()){
        showMsg("Invalid Signup CAPTCHA.");
        generateSignupCaptcha();
        return;
    }

    const email=document.getElementById("signupEmail").value;
    const pass=document.getElementById("signupPassword").value;

    auth.createUserWithEmailAndPassword(email,pass)
    .then(userCred=>{
        userCred.user.sendEmailVerification();
        showMsg("Account created. Verify your email.");
        showLogin();
    })
    .catch(err=>{
        showMsg(formatError(err));
    });
}

/* ================= RESET PASSWORD ================= */

function resetPassword(){
    const email=document.getElementById("loginEmail").value;
    if(!email){ 
        showMsg("Enter email first."); 
        return; 
    }

    auth.sendPasswordResetEmail(email)
    .then(()=>showMsg("Reset email sent."))
    .catch(err=>showMsg(formatError(err)));
}

/* ================= AUTH STATE ================= */
function monitorAuthState(){

    auth.onAuthStateChanged(function(user){

        const loginBtn=document.querySelector(".side-btn-login");
        const logoutBtn=document.querySelector(".side-btn-logout");
        const emailDisplay=document.getElementById("userEmailDisplay");

        if(!loginBtn || !logoutBtn || !emailDisplay) return;

        if(user){
            loginBtn.style.display="none";
            logoutBtn.style.display="block";
            emailDisplay.innerText="Logged in: "+user.email;
        }else{
            loginBtn.style.display="block";
            logoutBtn.style.display="none";
            emailDisplay.innerText="";
        }
    });
}

function logoutUser(){
    auth.signOut().then(()=>{
        window.location.href="index.html";
    });
}

/* ================= MESSAGE ================= */

function showMsg(msg){
    const el=document.getElementById("authMsg");
    if(el) el.innerText=msg;
}

function formatError(error){
    switch(error.code){
        case "auth/user-not-found": return "No account found.";
        case "auth/wrong-password": return "Incorrect password.";
        case "auth/email-already-in-use": return "Email already registered.";
        case "auth/weak-password": return "Password too weak.";
        case "auth/invalid-email": return "Invalid email.";
        default: return "Authentication failed.";
    }
}