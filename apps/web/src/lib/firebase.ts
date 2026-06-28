import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export const getMessagingClient = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

// Pide permiso de notificaciones al usuario y devuelve el token FCM del
// navegador. Devuelve null si el usuario lo rechaza o el navegador no
// soporta notificaciones push.
export async function solicitarPermisoPush(): Promise<string | null> {
  if (typeof window === 'undefined') return null; // evita correr esto en el servidor (SSR)

  const messaging = await getMessagingClient();
  if (!messaging) {
    console.warn('Este navegador no soporta notificaciones push');
    return null;
  }

  const permiso = await Notification.requestPermission();
  if (permiso !== 'granted') {
    console.warn('El usuario no otorgó permiso de notificaciones');
    return null;
  }

  try {
    return await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
  } catch (err) {
    console.error('Error obteniendo token FCM:', err);
    return null;
  }
}

// Envía el token obtenido al backend para que lo guarde en fcmTokens/{uid}
export async function registrarTokenEnBackend(token: string, jwt: string) {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/fcm-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ token }),
  });
}

export default app;