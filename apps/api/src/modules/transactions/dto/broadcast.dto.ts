export class BroadcastDto {
  chain: 'solana' | 'bnb' | 'bitcoin';
  rawTx: string;
}