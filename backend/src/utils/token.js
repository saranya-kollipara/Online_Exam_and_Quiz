import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'quentrix_super_secret_jwt_key_2026_academic_engine_#99';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

