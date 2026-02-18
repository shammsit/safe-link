// ================= SIDEBAR =================

function toggleSidebar(){
    document.getElementById("sidebar").classList.toggle("active");
}

function closeSidebar(){
    document.getElementById("sidebar").classList.remove("active");
}


// ================= SMOOTH REDIRECT =================

function smoothRedirect(page){
    document.body.style.opacity = 0;
    setTimeout(()=>{
        window.location.href = page;
    },300);
}

function goHome(){
    smoothRedirect("/index.html");
}

function goLogin(){
    smoothRedirect("/login.html");
}

function goDashboard(){
    smoothRedirect("/dashboard/dashboard.html");
}

function goBack(){
    if(window.history.length > 1){
        window.history.back();
    }else{
        smoothRedirect("/index.html");
    }
}


// ================= LOGOUT =================

function logoutUser(){
    if(typeof auth !== "undefined"){
        auth.signOut().then(()=>{
            smoothRedirect("/index.html");
        });
    }
}


// ================= AUTH STATE MONITOR =================

function monitorAuthState(){

    if(typeof auth === "undefined") return;

    auth.onAuthStateChanged(function(user){

        const loginBtn=document.querySelector(".side-btn-login");
        const logoutBtn=document.querySelector(".side-btn-logout");
        const dashboardBtn=document.querySelector(".side-btn-dashboard");
        const emailDisplay=document.getElementById("userEmailDisplay");

        if(!loginBtn || !logoutBtn || !dashboardBtn || !emailDisplay) return;

        if(user){
            loginBtn.style.display="none";
            logoutBtn.style.display="block";
            dashboardBtn.style.display="block";
            emailDisplay.innerText="Logged in: " + user.email;
        }else{
            loginBtn.style.display="block";
            logoutBtn.style.display="none";
            dashboardBtn.style.display="none";
            emailDisplay.innerText="";
        }

    });
}


// ================= GLOBAL LOADER REMOVE =================
// (1200ms KEPT EXACTLY AS YOU ASKED)

window.addEventListener("load", function(){

    const loader = document.getElementById("loader");
    const sound = document.getElementById("heartbeatSound");

    if(sound){
        sound.play();
    }

    if(loader){
        setTimeout(()=>{
            loader.style.display="none";
            if(sound){
                sound.pause();
                sound.currentTime = 0;
            }
        },1200);   // ⛔ DO NOT EDIT (as requested)
    }

});


// ================= INIT =================

document.addEventListener("DOMContentLoaded", function(){

    if(typeof firebase !== "undefined"){
        if(firebase.apps.length > 0){
            if(typeof auth !== "undefined"){
                monitorAuthState();
            }
        }
    }

});