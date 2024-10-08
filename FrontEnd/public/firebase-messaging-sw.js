importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);

self.addEventListener("message", (event) => {
  // Check if the firebaseConfig is present in the message data
  const { firebaseConfig } = event.data || {};

  console.log("Message received from client:", event.data);

  if (firebaseConfig) {
    console.log("firebaseConfig received from client:", firebaseConfig);

    // Initialize Firebase with the config
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      console.log("Firebase initialized with config:", firebaseConfig);
    } else {
      console.log("Firebase already initialized.");
    }
  } else {
    console.error("firebaseConfig is undefined");
  }

  // Initialize Firebase Messaging
  const messaging = firebase.messaging();

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
});
