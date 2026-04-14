// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Mendeklarasikan variabel global untuk Prisma di environment TypeScript
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Jika sudah ada koneksi, gunakan yang ada. Jika belum, buat baru.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Opsional: Akan memunculkan log di terminal tiap kali ada aktivitas database
  });

// Menyimpan koneksi di mode development agar tidak menumpuk saat hot-reload
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;