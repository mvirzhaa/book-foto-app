// src/app/dashboard/booking/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, CalendarDays, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

type Slot = { time: string; booked: number; capacity: number; isFull: boolean };

export default function BookingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  
  // State Form
  const [nim, setNim] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);

  // Efek Samping: Tarik data slot dari API setiap kali tanggal diubah
  useEffect(() => {
    if (!selectedDate) return;

    const fetchAvailableSlots = async () => {
      setIsLoadingSlots(true);
      setSlots([]); // Kosongkan slot lama saat loading
      setSelectedTime(""); // Reset pilihan jam

      try {
        const res = await fetch(`/api/booking/slots?date=${selectedDate}`);
        const json = await res.json();
        
        if (json.success) {
          setSlots(json.slots);
        } else {
          toast.error("Gagal memuat jadwal studio.");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan koneksi jaringan.");
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nim || !selectedDate || !selectedTime) {
      toast.error("Mohon lengkapi NIM, Tanggal, dan Jam Booking.");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Memproses jadwal Anda...");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nim,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
          type: "FOTO_STUDIO" // Opsional jika API masih membutuhkannya
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("🎉 Booking Berhasil! Silakan datang sesuai jadwal.", { id: loadingToast });
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        toast.error(`Gagal: ${data.message}`, { id: loadingToast });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi jaringan.", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  // Membatasi tanggal minimal hari ini (besok lebih direkomendasikan sebenarnya)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <header className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-[100px] -z-10"></div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <CalendarCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Booking Studio</h1>
              <p className="text-slate-500 mt-1">Pilih tanggal dan slot waktu untuk sesi pemotretan Anda.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            
            {/* Field NIM */}
            <div className="space-y-3 max-w-xl">
              <Label htmlFor="nim" className="text-slate-700 font-semibold text-base">Verifikasi NIM Anda</Label>
              <Input 
                id="nim" name="nim" placeholder="Masukkan NIM terdaftar..." required 
                className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-600 h-14 rounded-xl text-lg"
                value={nim} onChange={(e) => setNim(e.target.value)}
              />
            </div>

            {/* Field Tanggal */}
            <div className="space-y-3 max-w-xl">
              <Label htmlFor="bookingDate" className="text-slate-700 font-semibold text-base">1. Pilih Tanggal Kedatangan</Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <input 
                  type="date" id="bookingDate" name="bookingDate" required 
                  min={today}
                  className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none h-14 rounded-xl text-lg pl-12 pr-4 text-slate-700 cursor-pointer"
                  value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            {/* Field Grid Jam (Muncul jika tanggal sudah dipilih) */}
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold text-base">2. Pilih Slot Jam Tersedia</Label>
              
              {!selectedDate ? (
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 bg-slate-50/50">
                  Silakan pilih tanggal terlebih dahulu untuk melihat jadwal.
                </div>
              ) : isLoadingSlots ? (
                <div className="p-6 border border-slate-200 rounded-xl text-center text-indigo-500 bg-indigo-50/50 animate-pulse font-medium">
                  Mengecek ketersediaan studio...
                </div>
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {slots.map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={slot.isFull}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        slot.isFull 
                          ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60" 
                          : selectedTime === slot.time 
                            ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-md shadow-indigo-100 scale-[1.02]" 
                            : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/30"
                      }`}
                    >
                      <span className="font-bold text-lg mb-1">{slot.time}</span>
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Users className="w-3.5 h-3.5" />
                        <span>{slot.booked}/{slot.capacity} Terisi</span>
                      </div>
                      
                      {/* Lencana Penuh */}
                      {slot.isFull && (
                        <div className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-red-500/30">
                          PENUH
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <Button 
                type="submit" 
                disabled={isLoading || !selectedTime}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-10 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isLoading ? "Memproses..." : "Konfirmasi Booking"}
              </Button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}