import { Injectable } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';


@Injectable()
export class TransactionsService {
  
  async broadcast(chain: 'solana' | 'bnb' | 'bitcoin', rawTx: string): Promise<string> {
    switch (chain) {
      case 'solana': {
        const conn = new Connection(process.env.HELIUS_RPC_URL!);
        const sig = await conn.sendRawTransaction(Buffer.from(rawTx, 'base64'));
        await conn.confirmTransaction(sig, 'confirmed');
        return sig;
      }
      case 'bnb': {
        const provider = new ethers.JsonRpcProvider(process.env.QUICKNODE_BNB_URL);
        return (await provider.broadcastTransaction(rawTx)).hash;
      }
      default:
        throw new Error(`Chain ${chain} not implemented yet`);
    }
  }
    // Solana
  async getHistory(address: string, chain: string = 'solana') {
    if (chain === 'solana') {
      try {
        const conn = new Connection(process.env.HELIUS_RPC_URL!);
        const pubKey = new PublicKey(address);
        
        // Obtenemos el historial de firmas (limitado a 20 para no saturar)
        const signatures = await conn.getSignaturesForAddress(pubKey, { limit: 20 });
        
        return {
          address,
          chain,
          transactions: signatures,
        };
      } catch (error: any) {
        throw new Error(`Error al obtener el historial de Solana: ${error.message}`);
      }
    }

    // Estructura lista para cuando agregues BNB y Bitcoin en el futuro
    return {
      address,
      chain,
      transactions: [],
      message: `Lógica de historial para la red ${chain} pendiente de implementación`
    };
  }
}