// src/app/register/page.tsx
"use client";

import Link from "next/link";
import { Camera, ShieldCheck, Sparkles } from "lucide-react";
import { useRegister } from "@/hooks/useRegister";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  // Panggil logika dari custom hook
  const { formData, isLoading, masterData, availableProdi, handleChange, handleRegister } = useRegister();

  return (
    <div className="min-h-screen w-full flex font-sans bg-white">
      
      {/* BAGIAN KIRI: Branding (Sesuai desain asli Anda yang keren) */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px]" />

        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider">BPPSI UIKA</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Sistem Pendaftaran <br />
            <span className="text-blue-400">Foto Digital Terpadu</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Satu pintu untuk semua kebutuhan administrasi foto Ijazah dan KTM Anda. Mudah, cepat, dan aman.
          </p>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-slate-300">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Proses sepenuhnya digital tanpa antrean panjang</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>Data tersimpan aman dengan standar enkripsi</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          © 2026 BPPSI Universitas Ibn Khaldun Bogor.
        </div>
      </div>

      {/* BAGIAN KANAN: Form Pendaftaran (Modular) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Buat Akun Baru
            </h2>
            <p className="text-slate-500">
              Masukkan detail akademik Anda di bawah ini untuk memulai.
            </p>
          </div>

          {/* Render Komponen Form */}
          <RegisterForm 
            formData={formData} 
            isLoading={isLoading} 
            masterData={masterData}
            availableProdi={availableProdi}
            handleChange={handleChange} 
            onSubmit={handleRegister} 
          />

          <div className="text-center lg:text-left text-slate-500 text-sm mt-6">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              Masuk sekarang
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}