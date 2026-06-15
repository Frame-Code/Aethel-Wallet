import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Auth, DecodedIdToken } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';

import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase/firebase.module';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(FIREBASE_AUTH) private readonly firebaseAuth: Auth,
    @Inject(FIREBASE_DB) private readonly firestore: Firestore,
  ) {}

  // ── REGISTER ──────────────────────────────────────────────────────
  async register(dto: RegisterDto): Promise<{ message: string }> {
    try {
      // 1. Crear usuario en Firebase Auth
      const userRecord = await this.firebaseAuth.createUser({
        email: dto.email,
        password: dto.password,
        displayName: dto.username,
      });

      // 2. Guardar perfil en Firestore (NUNCA claves privadas ni mnemonic)
      await this.firestore.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: dto.email,
        username: dto.username,
        createdAt: FieldValue.serverTimestamp(),
      });

      this.logger.log(`Usuario registrado: ${userRecord.uid}`);
      return { message: 'Usuario registrado exitosamente' };

    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        throw new ConflictException('El email ya está registrado');
      }
      this.logger.error('Error en register', error);
      throw new InternalServerErrorException('Error al registrar el usuario');
    }
  }

  // ── LOGIN ─────────────────────────────────────────────────────────
  async login(dto: LoginDto): Promise<{
    access_token: string;
    refresh_token: string;
    uid: string;
  }> {
    // 1. Verificar que el idToken de Firebase sea válido
    let decodedToken: DecodedIdToken;
    try {
      decodedToken = await this.firebaseAuth.verifyIdToken(dto.idToken);
    } catch {
      throw new UnauthorizedException('idToken inválido o expirado');
    }

    const { uid, email } = decodedToken;

    // 2. Generar JWT propio de corta duración (ej: 1 hora)
    const payload = { sub: uid, email };
    const access_token = this.jwtService.sign(payload);

    // 3. Generar refresh token de larga duración con secreto distinto
    const refresh_token = this.jwtService.sign({ sub: uid, email: email as string }, { secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'), expiresIn: 2592000 });

    // 4. Guardar refresh token en Firestore para poder invalidarlo en logout
    await this.firestore.collection('refreshTokens').doc(uid).set({
      token: refresh_token,
      updatedAt: FieldValue.serverTimestamp(),
    });

    this.logger.log(`Login exitoso: ${uid}`);
    return { access_token, refresh_token, uid };
  }

  // ── REFRESH ───────────────────────────────────────────────────────
  async refresh(refreshToken: string): Promise<{ access_token: string }> {
    // 1. Verificar firma y expiración del refresh token
    let payload: { sub: string; email: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const { sub: uid } = payload;

    // 2. Comparar con el token en Firestore (evita reutilización tras logout)
    const doc = await this.firestore.collection('refreshTokens').doc(uid).get();
    if (!doc.exists || doc.data()?.token !== refreshToken) {
      throw new UnauthorizedException('Refresh token revocado');
    }

    // 3. Emitir nuevo access token
    const access_token = this.jwtService.sign({ sub: uid, email: payload.email });
    return { access_token };
  }

  // ── LOGOUT ────────────────────────────────────────────────────────
  async logout(uid: string): Promise<{ message: string }> {
    await this.firestore.collection('refreshTokens').doc(uid).delete();
    this.logger.log(`Logout: ${uid}`);
    return { message: 'Sesión cerrada exitosamente' };
  }
}