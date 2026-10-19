importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// This config must be hardcoded in the service worker — env vars are not available here.
// These are public-safe values (same ones in your frontend bundle).
firebase.initializeApp({
  apiKey: "AIzaSyCPscPXHR1KVfX1zJPi670v-d2_51hh2gU",
  authDomain: "karigar-b95a2.firebaseapp.com",
  projectId: "karigar-b95a2",
  storageBucket: "karigar-b95a2.firebasestorage.app",
  messagingSenderId: "1041836530715",
  appId: "1:1041836530715:web:064d30eb04a207fced2cbe",
  measurementId: "G-P9Y8FNK0J1"
});

const messaging = firebase.messaging();

// Handle background messages (when the tab is closed or in background)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const { title, body, icon } = payload.notification ?? {};

  self.registration.showNotification(title ?? 'Sentinel Chitral Alert', {
    body: body ?? 'A new warning has been issued for Chitral.',
    icon: icon ?? '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: payload.data ?? {},
    actions: [
      { action: 'view', title: 'View Map' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  });
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view') {
    event.waitUntil(clients.openWindow('/'));
  }
});
