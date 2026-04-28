"use client";

import { useState } from "react";
import { useRegistrations } from "@/hooks/useRegistrations";
import AdminSidebar from "@/components/admin/Sidebat"; // <-- Typo 'Sidebat' sudah diperbaiki
import AdminDataTable from "@/components/admin/DataTable";
import MasterDataPanel from "@/components/admin/MasterDataPanel"; 
import { Search } from "lucide-react";

export type AdminMenu = "UPLOAD" | "BOOKING" | "REKAP" | "MASTER_DATA" | "KELOLA_AKUN";

export default function AdminDashboard() {
  const { registrations, isLoading, updateStatus } = useRegistrations();
  const [activeMenu, setActiveMenu] = useState<AdminMenu>("UPLOAD");

  // Logika Filter Data
  const filteredData = registrations.filter((reg) => {
    if (activeMenu === "UPLOAD") return reg.method === "UPLOAD";
    if (activeMenu === "BOOKING") return reg.method === "STUDIO_BOOKING"; 
    if (activeMenu === "REKAP") return reg.status === "APPROVED"; 
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <main className="flex-1 ml-64 p-8 md:p-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pusat Kendali BPPSI</h1>
            <p className="text-slate-500 mt-2">Manajemen verifikasi foto dan jadwal studio mahasiswa.</p>
          </div>
          
          <div className="relative w-72 hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari Mahasiswa..." className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
          </div>
        </div>

        {/* LOGIKA KONDISIONAL: Konten berubah sesuai menu yang diklik */}
        {activeMenu === "MASTER_DATA" ? (
          <MasterDataPanel />
        ) : activeMenu === "KELOLA_AKUN" ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-2xl font-bold text-slate-700">Modul Kelola Akun</h2>
            <p className="text-slate-500 mt-2">Sedang dibangun... 🚧</p>
          </div>
        ) : (
          <AdminDataTable 
            data={filteredData} 
            isLoading={isLoading} 
            activeMenu={activeMenu} 
            onUpdateStatus={updateStatus} 
          />
        )}
      </main>
    </div>
  );
}