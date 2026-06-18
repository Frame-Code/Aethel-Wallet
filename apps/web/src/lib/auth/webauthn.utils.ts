import { btoa } from "buffer";

//Valida si existe disponibilidad de usar la api de autenticacion biometrica del dispositivo
export async function isBiometricAvailable(): Promise<boolean> {
    return (typeof window !== 'undefined' && !! window.PublicKeyCredential && !!navigator.credentials && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
}

//Convierte un array de bytes en base 64
export function bufferToBase64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

//Convierte un texto en base64 a un array de bytes
export function base64ToBuffer(value: string): Uint8Array<ArrayBuffer> {
    return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}