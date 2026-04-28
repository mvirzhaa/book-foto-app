// src/app/dashboard/booking/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function BookingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nim: "",
    type: "KTM",
    bookingDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("🎉 Booking Berhasil! Silakan datang ke BPPSI sesuai jadwal Anda.");
        router.push("/dashboard"); // Kembali ke dashboard
      } else {
        toast.error(`Gagal: ${data.message}`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  // Membatasi tanggal minimal hari ini untuk kalender
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* Header Sederhana */}
      <header className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 relative overflow-hidden">
          
          {/* Ornamen Desain */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-[100px] -z-10"></div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <CalendarCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Booking Studio</h1>
              <p className="text-slate-500 mt-1">Pesan jadwal sesi pemotretan Anda di BPPSI UIKA.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
            
            {/* Field NIM untuk Verifikasi */}
            <div className="space-y-3">
              <Label htmlFor="nim" className="text-slate-700 font-semibold text-base">Verifikasi NIM Anda</Label>
              <Input 
                id="nim" 
                name="nim"
                placeholder="Masukkan NIM terdaftar" 
                required 
                className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-600 h-14 rounded-xl text-lg"
                value={formData.nim}
                onChange={handleChange}
              />
            </div>

            {/* Field Jenis Foto */}
            <div className="space-y-3">
              <Label htmlFor="type" className="text-slate-700 font-semibold text-base">Jenis Foto</Label>
              <div className="relative">
                <select 
                  id="type" 
                  name="type" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none h-14 rounded-xl text-lg px-4 appearance-none text-slate-700"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="KTM">Kartu Tanda Mahasiswa (KTM)</option>
                  <option value="IJAZAH">Foto Ijazah</option>
                </select>
                {/* Custom Panah Dropdown */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Field Tanggal & Waktu */}
            <div className="space-y-3">
              <Label htmlFor="bookingDate" className="text-slate-700 font-semibold text-base">Pilih Tanggal & Waktu</Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Clock className="w-5 h-5" />
                </div>
                <input 
                  type="datetime-local" 
                  id="bookingDate" 
                  name="bookingDate"
                  required 
                  min={`${today}T08:00`} // Membatasi jam kerja minimal hari ini
                  className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none h-14 rounded-xl text-lg pl-12 pr-4 text-slate-700"
                  value={formData.bookingDate}
                  onChange={handleChange}
                />
              </div>
              <p className="text-sm text-slate-500 flex gap-2">
                * Jam operasional studio: 08:00 - 15:00 WIB
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoading ? "Memproses Jadwal..." : "Konfirmasi Booking"}
              </Button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}