import * as bitcoin from 'bitcoinjs-lib';
import { loadMnemonic } from '../crypto/vault';
import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);

export async function buildAndSignBTC(
  pin: string, 
  to: string, 
  amountSatoshi: number, 
  utxos: any[]
): Promise<string> {
  const mnemonic = await loadMnemonic(pin);
  
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = HDKey.fromMasterSeed(seed);
  
  // Ruta de derivación para Bitcoin
  const btcKey = root.derive("m/44'/0'/0'/0/0");
  const keyPair = ECPair.fromPrivateKey(Buffer.from(btcKey.privateKey!));
  
  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet });

  // Añadir los inputs (UTXOs)
  let inputSum = 0;
  utxos.forEach(utxo => {
    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      nonWitnessUtxo: Buffer.from(utxo.rawTx, 'hex'),
    });
    inputSum += utxo.value;
  });

  // Añadir el output (el envío al destinatario)
  psbt.addOutput({
    address: to,
    value: amountSatoshi,
  });

  // Calcular el cambio y enviarlo de vuelta a nuestra propia dirección
  const fee = 1000; // Tarifa de minería plana para el ejemplo (en satoshis)
  const change = inputSum - amountSatoshi - fee;
  
  if (change > 0) {
    const { address } = bitcoin.payments.p2pkh({ pubkey: Buffer.from(keyPair.publicKey as any), network: bitcoin.networks.testnet });
    psbt.addOutput({
      address: address!,
      value: change,
    });
  }

  // Firmar todos los inputs
  psbt.signAllInputs(keyPair as any);
  psbt.finalizeAllInputs();

  // Extraer y retornar la transacción serializada en formato hexadecimal
  return psbt.extractTransaction().toHex();
}