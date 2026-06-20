import { Injectable, BadRequestException } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';

interface IChainStrategy {
  broadcast(rawTx: string): Promise<string>;
  getHistory(address: string): Promise<any>;
}

class SolanaStrategy implements IChainStrategy {
  async broadcast(rawTx: string): Promise<string> {
    const conn = new Connection(process.env.HELIUS_RPC_URL!);
    const sig = await conn.sendRawTransaction(Buffer.from(rawTx, 'base64'));
    await conn.confirmTransaction(sig, 'confirmed');
    return sig;
  }
  
  async getHistory(address: string) {
    const conn = new Connection(process.env.HELIUS_RPC_URL!);
    const pubKey = new PublicKey(address);
    const signatures = await conn.getSignaturesForAddress(pubKey, { limit: 20 });
    return { address, chain: 'solana', transactions: signatures };
  }
}

class BnbStrategy implements IChainStrategy {
  async broadcast(rawTx: string): Promise<string> {
    const provider = new ethers.JsonRpcProvider(process.env.QUICKNODE_BNB_URL);
    const tx = await provider.broadcastTransaction(rawTx);
    return tx.hash;
  }

  async getHistory(address: string) {
    // Aquí iría la llamada a la API de BscScan en el futuro
    return { address, chain: 'bnb', transactions: [] };
  }
}

class BitcoinStrategy implements IChainStrategy {
  async broadcast(rawTx: string): Promise<string> {
    return 'btc_tx_hash_simulado'; 
  }

  async getHistory(address: string) {
    return { address, chain: 'bitcoin', transactions: [] };
  }
}

@Injectable()
export class TransactionsService {
  private strategies: Record<string, IChainStrategy>;

  constructor() {
    this.strategies = {
      'solana': new SolanaStrategy(),
      'bnb': new BnbStrategy(),
      'bitcoin': new BitcoinStrategy(),
    };
  }

  async broadcast(chain: string, rawTx: string): Promise<string> {
    const strategy = this.strategies[chain];
    if (!strategy) throw new BadRequestException(`La red ${chain} no está soportada.`);
    
    return await strategy.broadcast(rawTx);
  }

  async getHistory(chain: string, address: string) {
    const strategy = this.strategies[chain];
    if (!strategy) throw new BadRequestException(`La red ${chain} no está soportada.`);
    
    return await strategy.getHistory(address);
  }
}