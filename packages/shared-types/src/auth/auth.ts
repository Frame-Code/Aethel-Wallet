// packages/shared-types/src/auth.ts

/**
 * Representa las direcciones públicas generadas localmente.
 * NUNCA contiene claves privadas ni mnemonics.
 */
export interface WalletAddresses {
  solana: string;
  bitcoin: string;
  bnb: string;
}

/**
 * Perfil público del usuario que se almacena en Firebase Firestore.
 */
export interface UserProfile {
  uid: string;
  email: string;
  username?: string;
  addresses?: WalletAddresses;
}

/**
 * DTO enviado desde el frontend (Next.js) al backend (NestJS) para iniciar sesión.
 * Contiene el token generado por Firebase Auth tras validar email/password.
 */
export interface LoginRequestDto {
  idToken: string;
}

/**
 * Respuesta del backend tras validar el LoginRequestDto con éxito.
 */
export interface AuthResponseDto {
  access_token: string;
  refresh_token?: string; 
}

/**
 * DTO para registrar las direcciones públicas generadas por primera vez en el backend.
 */
export interface RegisterWalletsDto {
  addresses: WalletAddresses;
}

/**
 * Payload decodificado que viaja dentro del JWT del backend.
 * Útil para los Guards y Strategies de Passport en NestJS.
 */
export interface JwtPayload {
  sub: string; // Firebase UID
  email: string;
}