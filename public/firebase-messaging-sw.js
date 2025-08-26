// Give the service worker access to Firebase Messaging
// Note: This must be in the public directory to work properly
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js');

// Firebase configuration - replace with your actual values
// For development, you can use placeholder values, but FCM won't work until real config is provided
const firebaseConfig = {
  apiKey: "your-firebase-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Check if we have valid Firebase configuration
const hasValidConfig = firebaseConfig.apiKey !== "your-firebase-api-key" && 
                      firebaseConfig.projectId !== "your-project-id";

if (!hasValidConfig) {
  console.warn('[firebase-messaging-sw.js] Firebase configuration contains placeholder values. Please update with actual Firebase project configuration.');
  // Don't initialize Firebase with placeholder values to avoid errors
} else {
  try {
    // Initialize the Firebase app in the service worker
    firebase.initializeApp(firebaseConfig);
    
    // Retrieve an instance of Firebase Messaging so that it can handle background messages
    const messaging = firebase.messaging();

    // Handle background messages
    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message:', payload);
      
      const notificationTitle = payload.notification?.title || 'EduGenius';
      const notificationOptions = {
        body: payload.notification?.body || 'You have a new notification',
        icon: '/icons/icon1-192.png',
        badge: '/icons/icon1-96.png',
        tag: payload.data?.tag || 'general',
        data: {
          ...payload.data,
          url: payload.data?.url || '/dashboard'
        },
        actions: [
          {
            action: 'open',
            title: 'Open App',
            icon: '/icons/icon1-32.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ],
        requireInteraction: true,
        vibrate: [200, 100, 200]
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error initializing Firebase:', error);
  }
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received:', event);

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Handle notification click - open the app
  const urlToOpen = event.notification.data?.url || '/dashboard';
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    // Check if there's already a window/tab open with the target URL
    for (let i = 0; i < windowClients.length; i++) {
      const client = windowClients[i];
      if (client.url.includes(urlToOpen) && 'focus' in client) {
        return client.focus();
      }
    }

    // If no existing window/tab is found, open a new one
    if (clients.openWindow) {
      return clients.openWindow(urlToOpen);
    }
  });

  event.waitUntil(promiseChain);
});

// Handle push events
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Push event received:', event);
  
  if (event.data) {
    const payload = event.data.json();
    const notificationTitle = payload.notification?.title || 'EduGenius';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new notification',
      icon: '/icons/icon1-192.png',
      badge: '/icons/icon1-96.png',
      data: payload.data
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
});