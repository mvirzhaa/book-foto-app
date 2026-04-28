// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BPPSI UIKA | Pendaftaran Foto Digital",
  description: "Portal modern pendaftaran foto Ijazah dan KTM BPPSI UIKA Bogor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`}>
        {/* Kita biarkan main kosong tanpa class pembatas agar halaman bisa bebas berkreasi */}
        <main>
          {children}
        </main>
        {/* 2. Pasang Toaster di sini (posisi bebas, tapi biasanya di bawah children) */}
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '16px', // Sudut membulat yang elegan
            },
          }} 
        />
      </body>
    </html>
  );
}