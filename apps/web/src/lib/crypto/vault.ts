import { get, set, del } from 'idb-keyval';

interface VaultData {
  salt: number[];
  iv: number[]; //Vector de inicialización para AES-GCM
  ct: number[]; //Texto cifrado (ciphertext) del mnemonic
}

//Convierte el pin en una clave AES usando PBKDF2 y SHA-256 para derivar la clave. Se utiliza un salt aleatorio para mayor seguridad.
async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {

  //Base para derivar la key
  const rawKey = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  //Devuelve la clave AES 
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 250_000,
      hash: 'SHA-256', 
    } as Pbkdf2Params,
    rawKey,
    { name: 'AES-GCM', length: 256 } as AesDerivedKeyParams,
    false,
    ['encrypt', 'decrypt'],
  );
}

//Guarda la frase semilla cifrada en indexedDB
export async function storeMnemonic(mnemonic: string, pin: string): Promise<void> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pin, salt);

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(mnemonic),
  );

  const vaultData: VaultData = {
    salt: Array.from(salt),
    iv: Array.from(iv),
    ct: Array.from(new Uint8Array(ciphertext)),
  };

  await set('vault', vaultData);
}

//Obtiene la frase semilla descifrada de indexedDB usando el pin proporcionado
export async function loadMnemonic(pin: string): Promise<string> {
  const vaultData = await get<VaultData>('vault');

  if (!vaultData) {
    throw new Error('No hay wallet guardada en este dispositivo');
  }

  const { salt, iv, ct } = vaultData;
  const key = await deriveKey(pin, new Uint8Array(salt));

  try {

    //Intenta descifrar el mnemonic usando la clave derivada del pin y el salt almacenado
    const plaintext = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      key,
      new Uint8Array(ct),
    );
    return new TextDecoder().decode(plaintext);
  } catch {
    throw new Error('PIN incorrecto');
  }
}

export async function hasVault(): Promise<boolean> {
  const vaultData = await get<VaultData>('vault');
  return vaultData !== undefined;
}

export async function clearVault(): Promise<void> {
  await del('vault');
}