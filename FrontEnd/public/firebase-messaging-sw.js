importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

self.addEventListener("message", (event) => {
  const firebaseConfig = event.data.firebaseConfig;
  // Check if firebaseConfig is defined

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log("Received background message ", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon, // Optional: specify icon if needed
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
});
