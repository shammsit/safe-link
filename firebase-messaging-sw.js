importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCvP1NP1aMoiuJJsz_F4EgAC4JkHnv4VB8",
  authDomain: "safe-link-4d72d.firebaseapp.com",
  projectId: "safe-link-4d72d",
  messagingSenderId: "990848246096",
  appId: "1:990848246096:web:5d1c4d726cbae07520cc55"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png"
  });
});