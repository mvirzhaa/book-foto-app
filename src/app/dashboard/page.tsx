// src/app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, Calendar, Camera, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Muhamad Virzha"); // Menggunakan nama Anda sebagai contoh

  const handleLogout = () => {
    toast.success("Anda telah keluar.");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-200">
      
      {/* Navbar Premium */}
      <nav className="w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              BPPSI<span className="text-blue-600 font-medium">Portal</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-sm font-medium text-slate-500">
              Selamat datang, <span className="text-slate-900 font-bold">{userName}</span>
            </div>
            <div className="w-px h-6 bg-slate-200 hidden md:block"></div>
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl px-4 py-2 transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        
        {/* Header Section */}
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            Pilih Jalur <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Pendaftaran Foto Anda
            </span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            Sistem kami menyediakan dua cara mudah. Unggah file foto studio Anda sendiri dari rumah, atau jadwalkan sesi pemotretan profesional di studio BPPSI UIKA.
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Card 1: Upload */}
          <Link href="/dashboard/upload" className="group block">
            <div className="h-full bg-white rounded-3xl p-8 md:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              
              {/* Decorative Circle */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors duration-500"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <Upload className="w-8 h-8" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Unggah Mandiri</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Sudah punya file foto standar Ijazah/KTM? Unggah langsung dari perangkat Anda dan tunggu proses verifikasi admin.
                </p>

                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  Mulai Proses Unggah 
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" />
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Booking */}
          <Link href="/dashboard/booking" className="group block">
            <div className="h-full bg-white rounded-3xl p-8 md:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              
              {/* Decorative Circle */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors duration-500"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-600/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                  <Calendar className="w-8 h-8" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Booking Studio</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Pastikan kualitas foto terbaik dengan memesan jadwal sesi pemotretan langsung di studio profesional BPPSI UIKA.
                </p>

                <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all">
                  Pilih Jadwal Studio 
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" />
                </div>
              </div>
            </div>
          </Link>

        </div>

      </main>
    </div>
  );
}