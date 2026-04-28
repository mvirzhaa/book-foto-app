// src/app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, Fingerprint, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nim: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login Berhasil! Selamat datang, " + data.user.name);
        // Nanti kita arahkan ke halaman dashboard
        router.push("/dashboard"); 
      } else {
        toast.error(`Gagal: ${data.message}`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi. Pastikan internet Anda lancar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-white">
      
      {/* BAGIAN KIRI: Branding (Sama dengan halaman Register agar senada) */}
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
            Selamat Datang <br />
            <span className="text-blue-400">Kembali</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Masuk ke akun Anda untuk melanjutkan pendaftaran, mengunggah foto, atau melihat jadwal studio Anda.
          </p>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-slate-300">
              <Fingerprint className="w-5 h-5 text-blue-400" />
              <span>Akses aman dengan data terenkripsi</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Sistem cerdas dan mudah digunakan</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          © 2026 BPPSI Universitas Ibn Khaldun Bogor.
        </div>
      </div>

      {/* BAGIAN KANAN: Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Masuk ke Akun
            </h2>
            <p className="text-slate-500">
              Silakan masukkan NIM dan password Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nim" className="text-slate-700">Nomor Induk Mahasiswa</Label>
              <Input 
                id="nim" 
                name="nim"
                placeholder="2026xxxx" 
                required 
                className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-12 rounded-xl"
                value={formData.nim}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                {/* Opsi tambahan untuk masa depan: Lupa Password */}
                <span className="text-sm text-blue-600 hover:underline cursor-pointer">Lupa password?</span>
              </div>
              <Input 
                id="password" 
                name="password"
                type="password" 
                placeholder="••••••••" 
                required 
                className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-12 rounded-xl"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-semibold mt-4 transition-all hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-70"
            >
              {isLoading ? "Memeriksa data..." : "Masuk"}
            </Button>
          </form>

          <div className="text-center lg:text-left text-slate-500 text-sm mt-6">
            Belum memiliki akun?{" "}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              Daftar sekarang
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}