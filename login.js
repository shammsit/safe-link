let generatedLoginCaptcha = "";
let generatedSignupCaptcha = "";
let failedAttempts = 0;
let lockUntil = null;

document.addEventListener("DOMContentLoaded", function(){

    generateLoginCaptcha();
    generateSignupCaptcha();
    setupStrengthMeter();
    monitorAuthState();
});

/* ================= TOGGLE LOGIN / SIGNUP ================= */

function showLogin(){
    document.getElementById("loginBlock").style.display="block";
    document.getElementById("signupBlock").style.display="none";
    document.getElementById("loginTab").classList.add("active");
    document.getElementById("signupTab").classList.remove("active");
}

function showSignup(){
    document.getElementById("loginBlock").style.display="none";
    document.getElementById("signupBlock").style.display="block";
    document.getElementById("signupTab").classList.add("active");
    document.getElementById("loginTab").classList.remove("active");
}

/* ================= CAPTCHA GENERATOR ================= */

function randomCaptcha(){
    const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text="";
    for(let i=0;i<6;i++){
        text+=chars[Math.floor(Math.random()*chars.length)];
    }
    return text;
}

function generateLoginCaptcha(){
    generatedLoginCaptcha = randomCaptcha();
    const el=document.getElementById("loginCaptchaText");
    el.innerText=generatedLoginCaptcha;

    el.style.userSelect="none";
    el.style.transform="rotate("+(Math.random()*6-3)+"deg)";
    el.style.letterSpacing=(Math.random()*3+2)+"px";
}

function generateSignupCaptcha(){
    generatedSignupCaptcha = randomCaptcha();
    const el=document.getElementById("signupCaptchaText");
    el.innerText=generatedSignupCaptcha;

    el.style.userSelect="none";
    el.style.transform="rotate("+(Math.random()*6-3)+"deg)";
    el.style.letterSpacing=(Math.random()*3+2)+"px";
}

function loginCaptchaValid(){
    return document.getElementById("loginCaptchaInput").value === generatedLoginCaptcha;
}

function signupCaptchaValid(){
    return document.getElementById("signupCaptchaInput").value === generatedSignupCaptcha;
}

/* ================= PASSWORD STRENGTH (SIGNUP ONLY) ================= */

function setupStrengthMeter(){
    const input=document.getElementById("signupPassword");
    if(!input) return;

    input.addEventListener("input",function(){

        const val=this.value;
        const bar=document.getElementById("strengthBar");

        let strength=0;
        if(val.length>=8) strength+=25;
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

/* ================= BRUTE FORCE LOCK ================= */

function isLocked(){
    if(lockUntil && Date.now()<lockUntil){
        showMsg("Too many failed attempts. Please try again after 5 minutes.");
        return true;
    }
    return false;
}

/* ================= LOGIN ================= */

function login(){

    if(isLocked()) return;

    if(!loginCaptchaValid()){
        showMsg("Invalid CAPTCHA. Please try again.");
        generateLoginCaptcha();
        return;
    }

    const email=document.getElementById("loginEmail").value;
    const pass=document.getElementById("loginPassword").value;

    auth.signInWithEmailAndPassword(email,pass)
    .then(userCred=>{

        if(!userCred.user.emailVerified){
            showMsg("Please verify your email before logging in.");
            return;
        }

        window.location.href="dashboard/dashboard.html";
    })
    .catch(err=>{
        showMsg(formatError(err));
        failedAttempts++;

        if(failedAttempts>=5){
            lockUntil=Date.now()+300000; // 5 min lock
            failedAttempts=0;
        }
    });
}

/* ================= SIGNUP ================= */

function signup(){

    if(!signupCaptchaValid()){
        showMsg("Invalid CAPTCHA. Please try again.");
        generateSignupCaptcha();
        return;
    }

    const email=document.getElementById("signupEmail").value;
    const pass=document.getElementById("signupPassword").value;

    auth.createUserWithEmailAndPassword(email,pass)
    .then(userCred=>{
        userCred.user.sendEmailVerification();
        showMsg("Account created successfully. Please verify your email.");
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
        showMsg("Please enter your email address first.");
        return;
    }

    auth.sendPasswordResetEmail(email)
    .then(()=>showMsg("Password reset email has been sent."))
    .catch(err=>showMsg(formatError(err)));
}

/* ================= AUTH STATE ================= */

function monitorAuthState(){

    auth.onAuthStateChanged(function(user){

        const loginBtn=document.querySelector(".side-btn-login");
        const logoutBtn=document.querySelector(".side-btn-logout");
        const dashboardBtn=document.querySelector(".side-btn-dashboard");
        const emailDisplay=document.getElementById("userEmailDisplay");
        const donationBtn=document.getElementById("donationBtn");

        if(user){

            if(loginBtn) loginBtn.style.display="none";
            if(logoutBtn) logoutBtn.style.display="block";
            if(dashboardBtn) dashboardBtn.style.display="block";
            if(emailDisplay) emailDisplay.innerText="Logged in: "+user.email;

        }else{

            if(loginBtn) loginBtn.style.display="block";
            if(logoutBtn) logoutBtn.style.display="none";
            if(dashboardBtn) dashboardBtn.style.display="none";
            if(emailDisplay) emailDisplay.innerText="";
        }

        // Donation permanently disabled
        if(donationBtn){
            donationBtn.classList.add("disabled");
            donationBtn.onclick = null;
        }

    });
}

/* ================= LOGOUT ================= */

function logoutUser(){
    auth.signOut().then(()=>{
        window.location.href="../index.html";
    });
}

/* ================= ERROR FORMATTER ================= */

function formatError(error){

    switch(error.code){
        case "auth/user-not-found": return "No account found with this email.";
        case "auth/wrong-password": return "Incorrect password. Please try again.";
        case "auth/email-already-in-use": return "This email is already registered.";
        case "auth/weak-password": return "Password must be at least 6 characters.";
        case "auth/invalid-email": return "Invalid email format.";
        case "auth/too-many-requests": return "Too many attempts. Please try later.";
        default: return "Authentication failed. Please try again.";
    }
}

/* ================= MESSAGE DISPLAY ================= */

function showMsg(msg){
    const el=document.getElementById("authMsg");
    if(el) el.innerText=msg;
}