// Mock Firebase ANTES de cualquier import
jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  cert: jest.fn(),
}));

jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(),
  FieldValue: {
    serverTimestamp: jest.fn(() => 'mock-timestamp'),
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase/firebase.module';

// ── MOCKS ────────────────────────────────────────────────────────────

const mockFirebaseAuth = {
  createUser: jest.fn(),
  verifyIdToken: jest.fn(),
};

const mockFirestore = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  get: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
  verify: jest.fn(),
};

const mockConfigService = {
  getOrThrow: jest.fn().mockReturnValue('mock_refresh_secret'),
};

// ── SUITE PRINCIPAL ──────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: FIREBASE_AUTH, useValue: mockFirebaseAuth },
        { provide: FIREBASE_DB, useValue: mockFirestore },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register()', () => {

    it('should register a user and return success message', async () => {
      mockFirebaseAuth.createUser.mockResolvedValue({ uid: 'uid-123' });

      const result = await service.register({
        email: 'test@test.com',
        password: 'pass123',
        username: 'testuser',
      });

      expect(result).toEqual({ message: 'Usuario registrado exitosamente' });
      expect(mockFirebaseAuth.createUser).toHaveBeenCalledTimes(1);
      expect(mockFirestore.set).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockFirebaseAuth.createUser.mockRejectedValue({ code: 'auth/email-already-exists' });

      await expect(
        service.register({ email: 'dup@test.com', password: '123', username: 'dup' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockFirebaseAuth.createUser.mockRejectedValue(new Error('unknown'));

      await expect(
        service.register({ email: 'x@test.com', password: '123', username: 'x' }),
      ).rejects.toThrow(InternalServerErrorException);
    });

  });

  describe('login()', () => {

    it('should return access_token, refresh_token and uid on valid idToken', async () => {
      mockFirebaseAuth.verifyIdToken.mockResolvedValue({ uid: 'uid-123', email: 'test@test.com' });

      const result = await service.login({ idToken: 'valid.firebase.token' });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('uid', 'uid-123');
    });

    it('should throw UnauthorizedException on invalid idToken', async () => {
      mockFirebaseAuth.verifyIdToken.mockRejectedValue(new Error('invalid token'));

      await expect(
        service.login({ idToken: 'bad.token' }),
      ).rejects.toThrow(UnauthorizedException);
    });

  });

  describe('refresh()', () => {

    it('should return new access_token when refresh token is valid', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'uid-123', email: 'test@test.com' });
      mockFirestore.get.mockResolvedValue({
        exists: true,
        data: () => ({ token: 'valid.refresh.token' }),
      });

      const result = await service.refresh('valid.refresh.token');

      expect(result).toHaveProperty('access_token');
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error('expired'); });

      await expect(service.refresh('bad.token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if refresh token is revoked', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'uid-123', email: 'test@test.com' });
      mockFirestore.get.mockResolvedValue({
        exists: true,
        data: () => ({ token: 'different.token' }),
      });

      await expect(service.refresh('valid.refresh.token')).rejects.toThrow(UnauthorizedException);
    });

  });

  describe('logout()', () => {

    it('should delete refresh token and return success message', async () => {
      const result = await service.logout('uid-123');

      expect(result).toEqual({ message: 'Sesión cerrada exitosamente' });
      expect(mockFirestore.delete).toHaveBeenCalledTimes(1);
    });

  });

});