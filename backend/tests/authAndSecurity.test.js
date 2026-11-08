import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '../src/utils/token.js';

describe('Authentication & Security Cryptographic Layer', () => {
  test('should hash password and verify with bcrypt correctly', async () => {
    const rawPassword = 'StudentPassword@2026';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);

    expect(hash).not.toBe(rawPassword);
    const isMatch = await bcrypt.compare(rawPassword, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await bcrypt.compare('WrongPassword', hash);
    expect(isWrongMatch).toBe(false);
  });

  test('should sign and verify valid JWT token payload', () => {
    const payload = { userId: 'usr_test_123', email: 'test@quentrix.ai', role: 'STUDENT' };
    const token = generateToken(payload);
    expect(typeof token).toBe('string');

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  test('should return null for tampered or invalid token', () => {
    const badToken = 'header.payload.invalidsignature123';
    const decoded = verifyToken(badToken);
    expect(decoded).toBeNull();
  });
});

