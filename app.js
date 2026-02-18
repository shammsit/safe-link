console.log("js loaded");
window.onload = function(){

// =================================================
// USER + NAME
// =================================================
let currentUserId = localStorage.getItem("userId");

if(!currentUserId){
    currentUserId = "user_" + Math.random();
    localStorage.setItem("userId", currentUserId);
}

let userName = localStorage.getItem("userName");

if(!userName){
    userName = prompt("Enter your name");
    localStorage.setItem("userName", userName);
}


// =================================================
// ELEMENTS
// =================================================
let btn = document.getElementById("sosBtn");
let banner = document.getElementById("alertBanner");
let sound = document.getElementById("alertSound");
let status = document.getElementById("status");

sound.loop = true;


// =================================================
// MAP
// =================================================
let map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let userMarker=null;
let emergencyLayer=L.layerGroup().addTo(map);
let helpersLayer=L.layerGroup().addTo(map);
let routeControl=null;


// =================================================
// DISTANCE LABEL
// =================================================
let distanceLabel = L.control({position:'topright'});

distanceLabel.onAdd = function(){
    this._div = L.DomUtil.create('div','distanceBox');
    return this._div;
};

distanceLabel.addTo(map);


// =================================================
// FLAGS
// =================================================
let helpingMode=false;
let currentAlert=null;
let myAlertId=null;


// =================================================
// LIVE LOCATION
// =================================================
let myLat=null, myLng=null;

navigator.geolocation.watchPosition(
    function(pos){

        myLat = pos.coords.latitude;
        myLng = pos.coords.longitude;

        if(userMarker) map.removeLayer(userMarker);

        userMarker = L.marker([myLat, myLng], {
            icon: L.icon({
                iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                iconSize: [32, 32]
            })
        }).addTo(map);

        if(helpingMode && currentAlert){

            db.collection("responses")
            .doc(currentUserId)
            .update({
                lat: myLat,
                lng: myLng
            });

            drawRoute(currentAlert.latitude, currentAlert.longitude);
            updateDistanceLabel();
        }

    },
    function(error){
        console.log("Location error:", error);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
    }
);


// =================================================
// SEND SOS
// =================================================
btn.onclick=function(){

    if(!myLat || !myLng){
        alert("Location not ready");
        return;
    }

    let alertRef=db.collection("alerts").doc();

    alertRef.set({
        alertId:alertRef.id,
        userId:currentUserId,
        latitude:myLat,
        longitude:myLng,
        time:Date.now()
    });

    myAlertId=alertRef.id;
    localStorage.setItem("myAlertId",myAlertId);

    status.innerText="✅ SOS Sent";
    setTimeout(()=>status.innerText="",2000);
};



// =================================================
// DISTANCE FUNCTION
// =================================================
function getDistanceKm(lat1,lon1,lat2,lon2){

    const R=6371;

    let dLat=(lat2-lat1)*Math.PI/180;
    let dLon=(lon2-lon1)*Math.PI/180;

    let a=Math.sin(dLat/2)**2+
          Math.cos(lat1*Math.PI/180)*
          Math.cos(lat2*Math.PI/180)*
          Math.sin(dLon/2)**2;

    return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}


// =================================================
// ROUTE
// =================================================
function drawRoute(lat,lng){

    if(!myLat || !myLng) return;

    if(routeControl){
        routeControl.setWaypoints([
            L.latLng(myLat,myLng),
            L.latLng(lat,lng)
        ]);
        return;
    }

    routeControl=L.Routing.control({
        waypoints:[
            L.latLng(myLat,myLng),
            L.latLng(lat,lng)
        ],
        addWaypoints:false,
        draggableWaypoints:false,
        createMarker:()=>null
    }).addTo(map);
}


// =================================================
// DISTANCE LABEL UPDATE
// =================================================
function updateDistanceLabel(){

    if(!myLat || !currentAlert) return;

    let d=getDistanceKm(
        myLat,
        myLng,
        currentAlert.latitude,
        currentAlert.longitude
    );

    if(isNaN(d)) return;

    distanceLabel._div.innerHTML="📏 "+d.toFixed(2)+" km";
}



// =================================================
// ALERT LISTENER
// =================================================
db.collection("alerts").onSnapshot(function(snapshot){

    emergencyLayer.clearLayers();

    snapshot.forEach(function(doc){

        let d=doc.data();

        //if(!myLat) return;

        // 🔴 emergency marker
        L.marker([d.latitude,d.longitude],{
            icon:L.icon({
                iconUrl:"https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                iconSize:[32,32]
            })
        }).addTo(emergencyLayer);

        // IF SENDER → no accept/reject
        if(d.userId===currentUserId) return;

        currentAlert=d;

        sound.play();

        banner.innerHTML=`
            🚨 Emergency<br><br>
            <button id="acceptBtn">Accept</button>
            <button id="rejectBtn">Reject</button>
        `;

        banner.classList.remove("hidden");


        // ACCEPT
        document.getElementById("acceptBtn").onclick=function(){

            sound.pause();
            sound.currentTime=0;

            helpingMode=true;

            db.collection("responses")
            .doc(currentUserId+"_"+d.alertId)
            .set({
                alertId:d.alertId,
                senderId:d.userId,
                helperId:currentUserId,
                helperName:userName,
                lat:myLat,
                lng:myLng,
                status:"helping"
            });

            drawRoute(d.latitude,d.longitude);
            updateDistanceLabel();

            banner.innerHTML=`<button id="finishBtn">Finish Help</button>`;

            document.getElementById("finishBtn").onclick=function(){

                helpingMode=false;

                if(routeControl){
                    map.removeControl(routeControl);
                    routeControl=null;
                }

                distanceLabel._div.innerHTML="";

                db.collection("responses")
                .doc(currentUserId+"_"+d.alertId)
                .update({status:"finished"});

                banner.classList.add("hidden");
            };
        };


        // REJECT
        document.getElementById("rejectBtn").onclick=function(){

            sound.pause();
            sound.currentTime=0;

            banner.classList.add("hidden");
        };

    });

});



// =================================================
// HELPER TRACKING (Sender Side)
// =================================================
db.collection("responses").onSnapshot(function(snapshot){

    helpersLayer.clearLayers();

    snapshot.forEach(function(doc){

        let h=doc.data();

        let myAlert=localStorage.getItem("myAlertId");

        if(!myAlert) return;

        if(h.alertId!==myAlert) return;

        // 🟢 helper marker
        L.marker([h.lat,h.lng],{
            icon:L.icon({
                iconUrl:"https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                iconSize:[32,32]
            })
        }).addTo(helpersLayer)
        .bindPopup("Helper: "+h.helperName);


        // feedback only for sender
        if(h.status==="finished" && h.senderId===currentUserId){

            let ans=confirm(
                h.helperName+" helped you?\nOK=Yes / Cancel=No"
            );

            alert(ans?"Thanks for confirming ❤️":"Feedback recorded");

        }

    });

});

};