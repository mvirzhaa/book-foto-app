// src/app/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col w-full font-sans">
      {/* Navbar / Header */}
      <header className="w-full px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 flex justify-between items-center">
        <div className="font-black text-2xl tracking-tight text-slate-800">
          BPPSI <span className="text-blue-600">UIKA</span>
        </div>
        <div className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Portal Foto Digital
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-6 md:p-12 lg:p-24 bg-gradient-to-br from-white via-blue-50/50 to-indigo-100">
        
        {/* Teks Kiri */}
        <div className="lg:w-1/2 flex flex-col gap-6 text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1]">
            Pendaftaran Foto <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Ijazah & KTM
            </span>
          </h1>
          <p className="text-lg text-slate-600 lg:pr-12 leading-relaxed">
            Tinggalkan cara manual yang merepotkan. Kini pendaftaran, penjadwalan studio, hingga unggah foto mandiri dapat dilakukan dengan cepat dan mudah melalui satu portal terpadu.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-md px-8 py-6 rounded-full shadow-xl shadow-blue-200 transition-all hover:-translate-y-1">
                Daftar Sekarang
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-md px-8 py-6 rounded-full border-blue-200 text-blue-700 hover:bg-blue-50 transition-all hover:-translate-y-1 bg-white">
                Login ke Akun
              </Button>
            </Link>
          </div>
        </div>

        {/* Kartu Fitur Kanan (Glassmorphism style) */}
        <div className="lg:w-1/2 flex justify-center w-full">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white relative w-full max-w-md overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
            {/* Garis aksen di atas kartu */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-8 mt-2">Alur Pendaftaran:</h3>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-blue-100 text-blue-700 rounded-full font-bold w-10 h-10 flex items-center justify-center shrink-0 shadow-sm">1</div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">Buat Akun</p>
                  <p className="text-slate-500 mt-1">Daftar dengan cepat menggunakan NIM Anda.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-blue-100 text-blue-700 rounded-full font-bold w-10 h-10 flex items-center justify-center shrink-0 shadow-sm">2</div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">Pilih Metode</p>
                  <p className="text-slate-500 mt-1">Bebas pilih: Unggah foto dari rumah atau booking jadwal foto di studio kampus.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-blue-100 text-blue-700 rounded-full font-bold w-10 h-10 flex items-center justify-center shrink-0 shadow-sm">3</div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">Selesai & Pantau</p>
                  <p className="text-slate-500 mt-1">Tunggu verifikasi admin dan pantau status foto Anda secara real-time.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}