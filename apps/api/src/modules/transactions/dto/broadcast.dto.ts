import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class BroadcastDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['solana', 'bnb', 'bitcoin'])
  chain: string;

  @IsNotEmpty()
  @IsString()
  rawTx: string;
}