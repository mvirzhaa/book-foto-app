// src/app/dashboard/upload/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileImage, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function UploadPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null); // State untuk menyimpan pesan peringatan AI
  
  const [formData, setFormData] = useState({
    nim: "",
    type: "IJAZAH",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- FITUR CERDAS: Analisis Kualitas Gambar ---
  const analyzeImageQuality = (selectedFile: File): Promise<{ isGood: boolean, message: string }> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(selectedFile);
      
      img.onload = () => {
        // 1. Cek Resolusi (Standar Cetak Ijazah minimal ~400x600 pixel)
        if (img.width < 400 || img.height < 600) {
          return resolve({ isGood: false, message: "Resolusi foto terlalu rendah. Foto akan pecah atau blur saat dicetak." });
        }

        // 2. Cek Ketajaman menggunakan Canvas (Simulasi Edge Detection sederhana)
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve({ isGood: true, message: "OK" });

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Mengambil sampel piksel dari tengah foto (area wajah)
        const imageData = ctx.getImageData(img.width * 0.25, img.height * 0.25, img.width * 0.5, img.height * 0.5);
        const data = imageData.data;
        
        let maxBrightness = 0;
        let minBrightness = 255;

        // Mencari piksel paling terang dan paling gelap untuk menghitung kontras
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] * 0.299) + (data[i + 1] * 0.587) + (data[i + 2] * 0.114);
          if (brightness > maxBrightness) maxBrightness = brightness;
          if (brightness < minBrightness) minBrightness = brightness;
        }

        const contrast = maxBrightness - minBrightness;
        
        // Jika kontras sangat rendah (< 40), kemungkinan besar foto tersebut blur parah atau tertutup kabut
        if (contrast < 40) {
          return resolve({ isGood: false, message: "Sistem mendeteksi foto Anda mungkin terlalu blur atau pencahayaannya buruk." });
        }

        resolve({ isGood: true, message: "Kualitas foto terdeteksi baik." });
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setWarning(null); // Reset peringatan

    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setWarning("Ukuran foto maksimal 2MB. Silakan kompres foto Anda.");
        e.target.value = ""; 
        return;
      }
      
      // Jalankan fungsi analisis cerdas
      const qualityCheck = await analyzeImageQuality(selectedFile);
      if (!qualityCheck.isGood) {
        setWarning(qualityCheck.message); // Tampilkan pesan ke mahasiswa
        // Kita tidak memblokir upload, tapi memberi peringatan keras
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Harap pilih foto terlebih dahulu.");
      return;
    }
    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("file", file);
      submitData.append("nim", formData.nim);
      submitData.append("type", formData.type);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: submitData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✨ Sukses! Foto Anda berhasil diunggah ke server BPPSI.");
        router.push("/dashboard");
      } else {
        toast.error(`Gagal: ${data.message}`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi saat mengunggah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <header className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-[100px] -z-10"></div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Unggah Foto</h1>
              <p className="text-slate-500 mt-1">Kirimkan file foto studio mandiri Anda untuk diverifikasi.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="nim" className="text-slate-700 font-semibold text-base">Verifikasi NIM</Label>
                <Input 
                  id="nim" name="nim" placeholder="Masukkan NIM" required 
                  className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-14 rounded-xl text-lg"
                  value={formData.nim} onChange={handleChange}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="type" className="text-slate-700 font-semibold text-base">Jenis Foto</Label>
                <div className="relative">
                  <select 
                    id="type" name="type" required
                    className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none h-14 rounded-xl text-lg px-4 appearance-none text-slate-700"
                    value={formData.type} onChange={handleChange}
                  >
                    <option value="IJAZAH">Foto Ijazah</option>
                    <option value="KTM">Foto KTM</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold text-base">Pilih File Foto</Label>
              <Label 
                htmlFor="photo-upload" 
                className="flex flex-col items-center justify-center w-full h-56 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                  {fileName ? (
                    <>
                      <FileImage className="w-12 h-12 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                      <p className="mb-2 text-sm text-slate-700 font-semibold">{fileName}</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-12 h-12 text-slate-400 mb-3 group-hover:text-blue-500 group-hover:-translate-y-1 transition-all" />
                      <p className="mb-2 text-sm text-slate-600 font-medium">Klik untuk upload atau seret file ke sini</p>
                    </>
                  )}
                </div>
                <input id="photo-upload" type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={handleFileChange} />
              </Label>

              {/* Tampilan Peringatan Sistem Cerdas */}
              {warning ? (
                <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl text-sm text-amber-900 border border-amber-200 animate-in fade-in slide-in-from-top-2">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800">Peringatan Kualitas Gambar:</p>
                    <p>{warning}</p>
                    <p className="mt-1 text-xs text-amber-700 font-medium">Anda tetap bisa mengunggahnya, namun kemungkinan besar akan ditolak oleh Admin BPPSI.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100">
                  <Info className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                  <p>Sistem kami akan mengecek resolusi dan kualitas foto Anda secara otomatis sebelum diunggah.</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button 
                type="submit" disabled={isLoading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoading ? "Mengunggah..." : "Unggah Foto Sekarang"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}