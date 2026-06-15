import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';
import { Keypair } from '@solana/web3.js';
import * as bitcoin from 'bitcoinjs-lib';
import { ethers } from 'ethers';

export interface WalletAddresses {
  solana: string;
  bitcoin: string;
  bnb: string;
}

// Genera un mnemonic de 12 palabras aleatorio
export function generateMnemonic(): string {
  return bip39.generateMnemonic(128); // 128 bits = 12 palabras
}

// Valida que un mnemonic sea correcto (útil al importar wallet)
export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

// Deriva las direcciones públicas de las 3 cadenas a partir del mnemonic
// La clave privada existe solo dentro de esta función, nunca se persiste
export async function deriveAddresses(mnemonic: string): Promise<WalletAddresses> {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = HDKey.fromMasterSeed(seed);

  // ── SOLANA: m/44'/501'/0'/0' ──────────────────────────────────────
  const solKey = root.derive("m/44'/501'/0'/0'");
  const solana = Keypair.fromSeed(solKey.privateKey!).publicKey.toBase58();

  // ── BITCOIN: m/44'/0'/0'/0/0 ─────────────────────────────────────
  import('ecpair').then(() => {}); // solo para que el bundler lo reconozca
  const { ECPairFactory } = await import('ecpair');
  const ecc = await import('tiny-secp256k1');
  const ECPair = ECPairFactory(ecc);

  const btcKey = root.derive("m/44'/0'/0'/0/0");
  const btcPair = ECPair.fromPrivateKey(Buffer.from(btcKey.privateKey!));
  const { address: btcAddress } = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(btcPair.publicKey),
  });

  // ── BNB CHAIN (EVM): m/44'/60'/0'/0/0 ────────────────────────────
  const bnbKey = root.derive("m/44'/60'/0'/0/0");
  const bnb = new ethers.Wallet(
    '0x' + Buffer.from(bnbKey.privateKey!).toString('hex')
  ).address;

  return {
    solana,
    bitcoin: btcAddress!,
    bnb,
  };
}