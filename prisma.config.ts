// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  // DIRECT_URL digunakan untuk push/migrate karena memerlukan koneksi langsung (bukan melalui pgbouncer)
  datasource: {
    url: process.env.DIRECT_URL,
  },
});