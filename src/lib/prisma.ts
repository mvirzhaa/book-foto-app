// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Mendeklarasikan variabel global untuk Prisma di environment TypeScript
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 1. Ambil URL database dari file rahasia (.env)
const connectionString = process.env.DATABASE_URL;

// 2. Buat "Kolam Koneksi" (Connection Pool) standar PostgreSQL
const pool = new Pool({ connectionString });

// 3. Pasang Adapter resmi Prisma
const adapter = new PrismaPg(pool);

// 4. Gunakan Adapter tersebut di dalam Prisma Client
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter, // <-- Ini adalah kunci untuk mengatasi error 500 tadi!
  });

// Menyimpan koneksi di mode development agar tidak menumpuk saat hot-reload
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;