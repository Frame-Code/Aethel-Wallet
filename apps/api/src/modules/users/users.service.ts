import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { FIREBASE_DB } from '../../firebase/firebase.module';
import { Firestore, Timestamp } from 'firebase-admin/firestore';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

const CAMPOS_PROHIBIDOS = ['privateKey', 'mnemonic', 'seed', 'pin', 'seedPhrase'];

function validarSinCamposSensibles(data: Record<string, any>) {
  for (const campo of CAMPOS_PROHIBIDOS) {
    if (campo in data) {
      throw new ConflictException(`Campo no permitido en Firestore: ${campo}`);
    }
  }
}

@Injectable()
export class UsersService {
  constructor(@Inject(FIREBASE_DB) private readonly db: Firestore) {}

  async create(dto: CreateUserDto) {
    validarSinCamposSensibles(dto as any);

    const ref = this.db.collection('users').doc(dto.uid);
    const existing = await ref.get();
    if (existing.exists) {
      throw new ConflictException('El usuario ya tiene un perfil creado');
    }

    await ref.set({
      uid: dto.uid,
      email: dto.email,
      username: dto.username,
      fechaRegistro: Timestamp.now(),
      walletCreado: false,
      addresses: { solana: null, bitcoin: null, bnb: null },
    });

    return ref.get().then((doc) => doc.data());
  }

  async findOne(uid: string) {
    const doc = await this.db.collection('users').doc(uid).get();
    if (!doc.exists) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return doc.data();
  }

  async getSettings(uid: string) {
    const doc = await this.db
      .collection('users').doc(uid)
      .collection('settings').doc('preferences')
      .get();
    return doc.exists ? doc.data() : { idioma: 'es', tema: 'dark', monedaPreferida: 'USD' };
  }

  async updateSettings(uid: string, dto: UpdateSettingsDto) {
    validarSinCamposSensibles(dto as any);
    const ref = this.db
      .collection('users').doc(uid)
      .collection('settings').doc('preferences');
    await ref.set(dto, { merge: true });
    return ref.get().then((doc) => doc.data());
  }
}