// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// Menggunakan font Inter untuk tampilan yang profesional dan modern
const inter = Inter({ subsets: ["latin"] });

// Metadata ini bagus untuk SEO dan tampilan saat link dibagikan
export const metadata: Metadata = {
  title: "BPPSI UIKA | Sistem Pendaftaran Foto",
  description: "Portal pendaftaran foto Ijazah dan KTM BPPSI UIKA Bogor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`}>
        {/* Nanti kita bisa menambahkan Navbar global di sini */}
        
        {/* 'children' adalah tempat halaman-halaman kita akan dirender */}
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
          {children}
        </main>
        
        {/* Nanti kita bisa menambahkan Footer global di sini */}
      </body>
    </html>
  );
}