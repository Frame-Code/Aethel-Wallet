import { get, set, del } from 'idb-keyval';

// ── TIPOS ─────────────────────────────────────────────────────────────────────
interface VaultData {
  salt: number[];
  iv: number[];
  ct: number[];
}

// ── DERIVAR CLAVE AES-256 A PARTIR DEL PIN ────────────────────────────────────
// Usa PBKDF2 con 250,000 iteraciones — la clave nunca sale de WebCrypto
async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const rawKey = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 250_000,
      hash: 'SHA-256', 
    } as Pbkdf2Params, // <--- Cast principal para solucionar el error
    rawKey,
    { name: 'AES-GCM', length: 256 } as AesDerivedKeyParams,
    false, // extractable: false — la clave NUNCA sale de WebCrypto
    ['encrypt', 'decrypt'],
  );
}

// ── GUARDAR MNEMONIC CIFRADO EN INDEXEDDB ─────────────────────────────────────
// El mnemonic se cifra con AES-GCM usando una clave derivada del PIN
// NUNCA se guarda el mnemonic en texto plano ni en Firebase
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

  // idb-keyval guarda en IndexedDB — más seguro que localStorage
  await set('vault', vaultData);
}

// ── CARGAR Y DESCIFRAR MNEMONIC ───────────────────────────────────────────────
// Lanza error si el PIN es incorrecto (AES-GCM falla al descifrar)
export async function loadMnemonic(pin: string): Promise<string> {
  const vaultData = await get<VaultData>('vault');

  if (!vaultData) {
    throw new Error('No hay wallet guardada en este dispositivo');
  }

  const { salt, iv, ct } = vaultData;
  const key = await deriveKey(pin, new Uint8Array(salt));

  try {
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

// ── VERIFICAR SI EXISTE UNA WALLET GUARDADA ───────────────────────────────────
export async function hasVault(): Promise<boolean> {
  const vaultData = await get<VaultData>('vault');
  return vaultData !== undefined;
}

// ── ELIMINAR VAULT (logout / reset) ──────────────────────────────────────────
export async function clearVault(): Promise<void> {
  await del('vault');
}