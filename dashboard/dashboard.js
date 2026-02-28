document.addEventListener("DOMContentLoaded", function(){

    auth.onAuthStateChanged(function(user){

        if(!user){
            // Not logged in → redirect
            window.location.href="../login.html";
        }else{
            document.getElementById("welcomeEmail").innerText =
                "Welcome " + user.email;
        }

    });

});

function logoutUser(){
    auth.signOut().then(()=>{
        window.location.href="../login.html";
    });
}