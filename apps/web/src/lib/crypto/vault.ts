import { get, set, del } from 'idb-keyval';

interface VaultData {
  salt: number[];
  iv: number[];
  ct: number[];
}

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
    } as Pbkdf2Params,
    rawKey,
    { name: 'AES-GCM', length: 256 } as AesDerivedKeyParams,
    false,
    ['encrypt', 'decrypt'],
  );
}

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

export async function hasVault(): Promise<boolean> {
  const vaultData = await get<VaultData>('vault');
  return vaultData !== undefined;
}

export async function clearVault(): Promise<void> {
  await del('vault');
}