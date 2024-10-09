importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);
const firebaseConfig = {
  apiKey: "AIzaSyDla0I23YY8tYKcMYrjE8nq18wEli7arRA",
  authDomain: "stokemanagecalendar-dev.firebaseapp.com",
  projectId: "stokemanagecalendar-dev",
  storageBucket: "stokemanagecalendar-dev.appspot.com",
  messagingSenderId: "67332492484",
  appId: "1:67332492484:web:77f5d66bdf2bf3ff0b4d91",
  measurementId: "G-MTG64YYFVH",
};

// Initialize Firebase with the config
try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized with config:", firebaseConfig);
} catch (err) {
  console.log("Error: ", err);
}

// Initialize Firebase Messaging
const messaging = firebase.messaging();
console.log("Firebase Messaging initialized with instance:", messaging);

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon, // Optional: specify icon if needed
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// to get rid of logs
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
});
