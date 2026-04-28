// src/app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nim: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Oops! Password dan Konfirmasi Password tidak sama.");
      return;
    }

    try {
      // Mengirim data ke API Backend kita
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nim: formData.nim,
          name: formData.name,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Pendaftaran Berhasil! 🎉 Data Anda sudah masuk ke database.");
        // Kosongkan form setelah sukses
        setFormData({ nim: "", name: "", password: "", confirmPassword: "" });
        // Nanti kita tambahkan kode untuk otomatis pindah ke halaman Login di sini
      } else {
        toast.error(`Gagal: ${data.message}`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi. Pastikan internet Anda lancar.");
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-white">
      
      {/* BAGIAN KIRI: Branding (Disembunyikan di HP, Muncul di Layar Besar) */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative flex-col justify-between p-12 overflow-hidden">
        {/* Efek Lingkaran Cahaya di Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px]" />

        {/* Header Kiri */}
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider">BPPSI UIKA</span>
        </div>

        {/* Konten Tengah Kiri */}
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

        {/* Footer Kiri */}
        <div className="relative z-10 text-slate-500 text-sm">
          © 2026 BPPSI Universitas Ibn Khaldun Bogor.
        </div>
      </div>

      {/* BAGIAN KANAN: Form Pendaftaran */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header Form */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Buat Akun Baru
            </h2>
            <p className="text-slate-500">
              Masukkan detail Anda di bawah ini untuk memulai.
            </p>
          </div>

          {/* Form */}
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
              <Label htmlFor="name" className="text-slate-700">Nama Lengkap</Label>
              <Input 
                id="name" 
                name="name"
                placeholder="Sesuai SIAKAD" 
                required 
                className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-12 rounded-xl"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700">Konfirmasi</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-12 rounded-xl"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-semibold mt-4 transition-all hover:shadow-lg hover:shadow-blue-600/30">
              Buat Akun Saya
            </Button>
          </form>

          {/* Link ke Login */}
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