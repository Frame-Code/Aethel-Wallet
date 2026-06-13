# Wallet Aethel

Wallet no-custodial multichain para Solana, Bitcoin y BNB Chain. Proyecto de tesis académica — Bases de Datos Avanzado, Universidad de Guayaquil.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 (React 19, TypeScript, Tailwind CSS 3) |
| Backend | NestJS 11 (Express, TypeScript) |
| Base de datos | Firebase Firestore |
| Auth | Firebase Auth + JWT |
| Blockchain | Solana (Helius RPC), Bitcoin (QuickNode), BNB Chain (QuickNode/Ankr) |
| Monorepo | Turborepo + npm workspaces |

## Estructura

```
wallet-aethel/
├── apps/
│   ├── web/               # PWA Next.js — puerto 3000
│   └── api/               # REST API NestJS — puerto 3001
├── packages/
│   └── shared-types/      # DTOs compartidos
├── turbo.json
└── package.json
```

## Requisitos

- Node.js >= 20
- npm >= 10

## Desarrollo

```bash
# Instalar dependencias
npm install

# Levantar ambos servidores en paralelo
npm run dev
```

La terminal mostrará `[API]` en azul (puerto 3001) y `[WEB]` en verde (puerto 3000).

## Scripts disponibles

```bash
npm run dev          # API + Web en paralelo (concurrently)
npm run build        # Build de producción (Turborepo)
npm run lint         # Lint todos los paquetes
npm run test         # Tests todos los paquetes
npm run type-check   # Verificación TypeScript
```

## Principio de seguridad

> Las claves privadas y seed phrases **nunca** se almacenan en servidores ni en Firebase.

- Todo el cifrado ocurre localmente: **Web Crypto API + IndexedDB** (`extractable: false`)
- La firma de transacciones ocurre **100% en el frontend**
- Firebase Firestore almacena únicamente: UID, email, username, direcciones públicas y preferencias
- Autenticación biométrica via **WebAuthn/FIDO2**

## Módulos de la API (`/v1`)

| Módulo | Ruta |
|--------|------|
| Auth | `/v1/auth` |
| Wallet | `/v1/wallet` |
| Assets | `/v1/assets` |
| Transfers | `/v1/transfers` |
| Prices | `/v1/prices` |
| Notifications | `/v1/notifications` |
| dApps | `/v1/dapps` |

## Variables de entorno

Copiar `apps/api/.env.example` a `apps/api/.env` y completar los valores.

```env
PORT=3001
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
JWT_SECRET=
```
