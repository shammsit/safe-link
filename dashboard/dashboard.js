const adminName = localStorage.getItem("adminName");
const adminId = localStorage.getItem("adminId");
const welcomeText = document.querySelector("h1");
const adminInfo = document.getElementById("adminInfo");
const adminDisplay = document.getElementById("adminDisplay");
// ✅ SET NAME IN HEADER
if(adminName){
    welcomeText.innerText = "Welcome " + adminName;
} else {
    welcomeText.innerText = "Welcome " + adminId;
}
// ✅ SHOW IN BOX
if(adminInfo){
    adminInfo.innerHTML = `
        <b>Name:</b> ${adminName || "N/A"} <br>
        <b>Admin ID:</b> ${adminId}
    `;
}
// ✅ SHOW IN SIDEBAR
if(adminDisplay){
    adminDisplay.innerText = adminName || adminId;
}
function logoutUser(){
    auth.signOut().then(()=>{
        window.location.href="../login.html";
    });
}