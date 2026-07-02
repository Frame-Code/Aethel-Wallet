import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FIREBASE_DB } from '../../firebase/firebase.module';
import { Firestore } from 'firebase-admin/firestore';
import { SaveAddressesDto } from './dto/save-addresses.dto';

@Injectable()
export class WalletService {
  constructor(@Inject(FIREBASE_DB) private readonly db: Firestore) {}

  async saveAddresses(uid: string, dto: SaveAddressesDto) {
    const userRef = this.db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw new NotFoundException('Usuario no encontrado, crea el perfil primero');
    }

    if (!dto.solana && !dto.bitcoin && !dto.bnb) {
      throw new BadRequestException('Debes enviar al menos una dirección');
    }

    // Usamos notación de punto para actualizar solo los campos enviados,
    // sin pisar las otras direcciones que ya pudieran existir.
    const updates: Record<string, string> = {};
    if (dto.solana) updates['addresses.solana'] = dto.solana;
    if (dto.bitcoin) updates['addresses.bitcoin'] = dto.bitcoin;
    if (dto.bnb) updates['addresses.bnb'] = dto.bnb;

    await userRef.update({ ...updates, walletCreado: true });

    return userRef.get().then((doc) => doc.data()?.addresses ?? {});
  }

  async getAddresses(uid: string) {
    const doc = await this.db.collection('users').doc(uid).get();
    if (!doc.exists) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return doc.data()?.addresses ?? { solana: null, bitcoin: null, bnb: null };
  }
}