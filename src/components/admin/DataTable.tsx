// src/components/admin/DataTable.tsx
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Registration } from "@/types";
import { AdminMenu } from "@/app/admin/page";

interface DataTableProps {
  data: Registration[];
  isLoading: boolean;
  activeMenu: AdminMenu;
  onUpdateStatus: (id: string, status: string) => void;
}

export default function AdminDataTable({ data, isLoading, activeMenu, onUpdateStatus }: DataTableProps) {
  
  // Fungsi pembantu untuk visualisasi status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED": 
        return <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold flex items-center gap-1.5 w-max border border-green-200"><CheckCircle className="w-3.5 h-3.5"/> Disetujui</span>;
      case "REJECTED": 
        return <span className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-bold flex items-center gap-1.5 w-max border border-red-200"><XCircle className="w-3.5 h-3.5"/> Ditolak</span>;
      default: 
        return <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1.5 w-max border border-amber-200"><Clock className="w-3.5 h-3.5"/> Menunggu</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/50 border-b border-slate-200/80 text-slate-500 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-5">Mahasiswa</th>
              {activeMenu === "REKAP" && (
                <>
                  <th className="px-6 py-5">Fakultas / Prodi</th>
                  <th className="px-6 py-5">Angkatan</th>
                </>
              )}
              <th className="px-6 py-5">Layanan</th>
              <th className="px-6 py-5">Metode / Jadwal</th>
              {activeMenu !== "REKAP" && <th className="px-6 py-5">Status</th>}
              {activeMenu !== "REKAP" && <th className="px-6 py-5 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium animate-pulse">Memuat data...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">Tidak ada data di kategori ini.</td>
              </tr>
            ) : (
              data.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                  
                  {/* Kolom Profil */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-base">{reg.user.name}</div>
                    <div className="text-slate-500 text-xs mt-1 font-medium">{reg.user.nim}</div>
                  </td>

                  {/* Kolom Akademik (Hanya Tab Rekap) */}
                  {activeMenu === "REKAP" && (
                    <>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-700">{reg.user.fakultas || <span className="text-slate-300 italic font-normal">Belum diisi</span>}</div>
                        <div className="text-slate-500 text-xs mt-1">{reg.user.prodi || <span className="text-slate-300 italic">-</span>}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-semibold">
                        {reg.user.angkatan || <span className="text-slate-300 italic font-normal">Belum diisi</span>}
                      </td>
                    </>
                  )}

                  <td className="px-6 py-4 font-semibold text-slate-700">Foto {reg.type}</td>
                  
                  <td className="px-6 py-4">
                    {reg.method === "UPLOAD" ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-blue-600 font-bold text-xs bg-blue-50 px-2 py-1 rounded-md w-max">Unggah Mandiri</span>
                        {reg.photoUrl && (
                          <a href={reg.photoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors">
                            <Eye className="w-3.5 h-3.5 mr-1" /> Lihat Foto
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-indigo-600 font-bold text-xs bg-indigo-50 px-2 py-1 rounded-md w-max">Studio Kampus</span>
                        <span className="text-slate-600 text-xs font-medium">
                          {reg.bookingDate ? new Date(reg.bookingDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : "-"} WIB
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Kolom Status & Aksi */}
                  {activeMenu !== "REKAP" && (
                    <>
                      <td className="px-6 py-4">{getStatusBadge(reg.status)}</td>
                      <td className="px-6 py-4 text-right">
                        {reg.status === "PENDING" && (
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => onUpdateStatus(reg.id, "APPROVED")} 
                              className="bg-green-600 hover:bg-green-700 text-white h-9 text-xs rounded-xl font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
                            >
                              Setujui
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => onUpdateStatus(reg.id, "REJECTED")} 
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 h-9 text-xs rounded-xl font-semibold transition-transform hover:-translate-y-0.5"
                            >
                              Tolak
                            </Button>
                          </div>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}