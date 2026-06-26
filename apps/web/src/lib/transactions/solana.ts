import { Connection, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import { loadMnemonic } from '@/lib/crypto/vault';
import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';

export async function buildAndSignSOL(pin: string, to: string, amountSOL: number): Promise<string> {
  // 1. Descifrar mnemonic localmente con PIN
  const mnemonic = await loadMnemonic(pin);

  // 2. Re-derivar keypair (clave privada existe solo en esta función, nunca se persiste)
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = HDKey.fromMasterSeed(seed);
  const keypair = Keypair.fromSeed(root.derive("m/44'/501'/0'/0'").privateKey!);

  // 3. Construir y firmar transacción
  const conn = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC_URL!);
  const { blockhash } = await conn.getLatestBlockhash();
  const tx = new Transaction({ recentBlockhash: blockhash, feePayer: keypair.publicKey });

  tx.add(SystemProgram.transfer({
    fromPubkey: keypair.publicKey,
    toPubkey: new PublicKey(to),
    lamports: Math.floor(amountSOL * LAMPORTS_PER_SOL)
  }));

  tx.sign(keypair);

  // 4. Retornar tx serializada. El frontend la envía al backend para broadcast
  return tx.serialize().toString('base64');
}