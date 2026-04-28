// src/components/admin/Sidebar.tsx
import { LayoutDashboard, UploadCloud, CalendarDays, FileSpreadsheet, LogOut } from "lucide-react";
import { AdminMenu } from "@/app/admin/page"; 

interface SidebarProps {
  activeMenu: AdminMenu;
  setActiveMenu: (menu: AdminMenu) => void;
}

export default function AdminSidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col fixed h-full z-20 shadow-xl">
      {/* Header Sidebar */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
        <LayoutDashboard className="w-6 h-6 text-blue-500 mr-3" />
        <span className="font-extrabold text-xl text-white tracking-tight">
          Admin<span className="text-blue-500 font-medium">Panel</span>
        </span>
      </div>

      {/* Menu Navigasi */}
      <div className="flex-1 py-8 flex flex-col gap-2 px-4">
        <p className="text-[10px] font-bold text-slate-500 mb-2 px-2 uppercase tracking-widest">Manajemen</p>
        
        <button 
          onClick={() => setActiveMenu("UPLOAD")}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
            activeMenu === "UPLOAD" 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" 
              : "hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <UploadCloud className="w-5 h-5" />
          <span className="font-semibold text-sm">Unggah Mandiri</span>
        </button>
        
        <button 
          onClick={() => setActiveMenu("BOOKING")}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
            activeMenu === "BOOKING" 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40" 
              : "hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="font-semibold text-sm">Booking Studio</span>
        </button>

        <p className="text-[10px] font-bold text-slate-500 mt-8 mb-2 px-2 uppercase tracking-widest">Laporan</p>

        <button 
          onClick={() => setActiveMenu("REKAP")}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
            activeMenu === "REKAP" 
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40" 
              : "hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span className="font-semibold text-sm">Rekapitulasi</span>
        </button>
      </div>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-slate-800/50">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300">
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  );
}