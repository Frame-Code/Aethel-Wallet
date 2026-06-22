import { IsOptional, Matches } from 'class-validator';

export class SaveAddressesDto {
  @IsOptional()
  @Matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, {
    message: 'Dirección de Solana inválida (debe ser base58, 32-44 caracteres)',
  })
  solana?: string;

  @IsOptional()
  @Matches(/^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{25,90})$/, {
    message: 'Dirección de Bitcoin inválida',
  })
  bitcoin?: string;

  @IsOptional()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'Dirección de BNB Chain inválida (debe ser formato 0x...)',
  })
  bnb?: string;
}