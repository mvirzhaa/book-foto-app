// src/components/admin/Sidebar.tsx
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  LayoutDashboard, 
  UploadCloud, 
  CalendarDays, 
  FileSpreadsheet, 
  Database, 
  Users, 
  LogOut 
} from "lucide-react";
import { AdminMenu } from "@/app/admin/page"; 

interface SidebarProps {
  activeMenu: AdminMenu;
  setActiveMenu: (menu: AdminMenu) => void;
}

export default function AdminSidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const router = useRouter();

  // FUNGSI LOGOUT
  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px] p-1">
        <p className="text-sm font-medium text-slate-800">
          Yakin ingin keluar dari Pusat Kendali?
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold">
            Batal
          </button>
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              // Hapus data user dari localStorage
              localStorage.removeItem("user");
              
              const loadingToast = toast.loading("Mengeluarkan Anda...");
              setTimeout(() => {
                toast.dismiss(loadingToast);
                toast.success("Berhasil keluar.");
                router.push("/login"); // Tendang ke halaman login
              }, 1000);
            }} 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: "top-center" });
  };

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col fixed h-full z-20 shadow-xl overflow-y-auto">
      {/* Header Sidebar */}
      <div className="h-20 flex-shrink-0 flex items-center px-6 border-b border-slate-800/50 sticky top-0 bg-[#0F172A] z-10">
        <LayoutDashboard className="w-6 h-6 text-blue-500 mr-3" />
        <span className="font-extrabold text-xl text-white tracking-tight">
          Admin<span className="text-blue-500 font-medium">Panel</span>
        </span>
      </div>

      {/* Menu Navigasi */}
      <div className="flex-1 py-8 flex flex-col gap-2 px-4">
        
        {/* GRUP 1: LAYANAN */}
        <p className="text-[10px] font-bold text-slate-500 mb-1 px-2 uppercase tracking-widest">Layanan Utama</p>
        <button onClick={() => setActiveMenu("UPLOAD")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${activeMenu === "UPLOAD" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "hover:bg-slate-800/80 hover:text-white"}`}>
          <UploadCloud className="w-5 h-5" /> <span className="font-semibold text-sm">Unggah Mandiri</span>
        </button>
        <button onClick={() => setActiveMenu("BOOKING")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${activeMenu === "BOOKING" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40" : "hover:bg-slate-800/80 hover:text-white"}`}>
          <CalendarDays className="w-5 h-5" /> <span className="font-semibold text-sm">Booking Studio</span>
        </button>

        {/* GRUP 2: LAPORAN */}
        <p className="text-[10px] font-bold text-slate-500 mt-6 mb-1 px-2 uppercase tracking-widest">Laporan</p>
        <button onClick={() => setActiveMenu("REKAP")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${activeMenu === "REKAP" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40" : "hover:bg-slate-800/80 hover:text-white"}`}>
          <FileSpreadsheet className="w-5 h-5" /> <span className="font-semibold text-sm">Rekapitulasi</span>
        </button>

        {/* GRUP 3: SISTEM (MENU BARU) */}
        <p className="text-[10px] font-bold text-slate-500 mt-6 mb-1 px-2 uppercase tracking-widest">Pengaturan Sistem</p>
        <button onClick={() => setActiveMenu("MASTER_DATA")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${activeMenu === "MASTER_DATA" ? "bg-amber-600 text-white shadow-lg shadow-amber-900/40" : "hover:bg-slate-800/80 hover:text-white"}`}>
          <Database className="w-5 h-5" /> <span className="font-semibold text-sm">Master Data</span>
        </button>
        <button onClick={() => setActiveMenu("KELOLA_AKUN")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${activeMenu === "KELOLA_AKUN" ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" : "hover:bg-slate-800/80 hover:text-white"}`}>
          <Users className="w-5 h-5" /> <span className="font-semibold text-sm">Kelola Akun</span>
        </button>

      </div>

      {/* Footer Sidebar (Tombol Logout Aktif) */}
      <div className="p-4 border-t border-slate-800/50 flex-shrink-0">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  );
}