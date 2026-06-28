importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCNgNUCNhqTPrUcN7jduwBLNJO7jshZc5Q",
  authDomain: "wallet-aethel.firebaseapp.com",
  projectId: "wallet-aethel",
  storageBucket: "wallet-aethel.firebasestorage.app",
  messagingSenderId: "509421037814",
  appId: "1:509421037814:web:6fba9ea346fef4bb7c24d7",
});

const messaging = firebase.messaging();

// Esto se dispara cuando llega una notificación y la pestaña no está activa
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});