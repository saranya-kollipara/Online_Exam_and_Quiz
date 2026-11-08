import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['error', 'warn']
    });
  }
  prisma = global.__prisma;
}

export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    logger.success('Connected to MySQL Database via Prisma ORM successfully.');
    return true;
  } catch (err) {
    logger.warn('MySQL Database connection deferred: ' + err.message);
    return false;
  }
}

export { prisma };
export default prisma;

