import { ethers } from 'ethers';
import { loadMnemonic } from '../crypto/vault';
import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';

export async function buildAndSignBNB(pin: string, to: string, amountBNB: string): Promise<string> {
  // 1. Descifrar mnemonic localmente con PIN
  const mnemonic = await loadMnemonic(pin);

  // 2. Re-derivar la clave privada de BNB (Ruta EVM estándar)
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = HDKey.fromMasterSeed(seed);
  const bnbKey = root.derive("m/44'/60'/0'/0/0");
  
  // Convertir la clave privada a un formato que ethers.js
  const privateKeyHex = '0x' + Buffer.from(bnbKey.privateKey!).toString('hex');
  const wallet = new ethers.Wallet(privateKeyHex);

  // 3. Conectar al proveedor RPC de Alchemy para BNB y construir la transacción
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_BNB_URL!);
  const walletConnected = wallet.connect(provider);
  const tx = {
    to: to,
    value: ethers.parseEther(amountBNB),
  };

  // 4. Firmar la transacción localmente
  const signedTx = await walletConnected.signTransaction(tx);

  // 5. Retornar la tx serializada (el frontend la enviará al backend POST /v1/transactions/broadcast)
  return signedTx;
}