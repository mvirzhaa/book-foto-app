// src/components/admin/DataTable.tsx
import { FileDown, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminMenu } from "@/app/admin/page";
import toast from "react-hot-toast";
import * as XLSX from "xlsx"; // <-- Import library Excel yang baru diinstall

interface DataTableProps {
  data: any[];
  isLoading: boolean;
  activeMenu: AdminMenu;
  onUpdateStatus: (id: string, newStatus: "APPROVED" | "REJECTED") => void;
}

export default function AdminDataTable({ data, isLoading, activeMenu, onUpdateStatus }: DataTableProps) {
  
  // FUNGSI SAKTI EXPORT EXCEL
  const handleExportExcel = () => {
    if (data.length === 0) {
      toast.error("Tidak ada data untuk diekspor!");
      return;
    }

    const toastId = toast.loading("Menyiapkan file Excel...");

    try {
      // 1. Format ulang data agar rapi di Excel
      const exportData = data.map((item, index) => ({
        "No": index + 1,
        "NIM": item.user?.nim || "-",
        "Nama Mahasiswa": item.user?.name || "-",
        "Fakultas": item.user?.fakultas || "-",
        "Program Studi": item.user?.prodi || "-",
        "Angkatan": item.user?.angkatan || "-",
        "Layanan": item.method === "UPLOAD" ? "Unggah Mandiri" : "Booking Studio",
        "Status": item.status,
        "Tanggal Pengajuan": new Date(item.createdAt).toLocaleDateString("id-ID", {
          day: '2-digit', month: 'long', year: 'numeric'
        })
      }));

      // 2. Buat Worksheet & Workbook
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap BPPSI");

      // 3. Picu unduhan file
      XLSX.writeFile(workbook, `Rekap_Foto_BPPSI_${new Date().getTime()}.xlsx`);
      
      toast.success("File Excel berhasil diunduh!", { id: toastId });
    } catch (error) {
      toast.error("Gagal membuat file Excel.", { id: toastId });
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-slate-400 animate-pulse font-medium">Memuat data mahasiswa...</div>;
  }

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      
      {/* HEADER TABEL */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="font-bold text-lg text-slate-800">
          {activeMenu === "UPLOAD" ? "Antrean Verifikasi Unggah Mandiri" : 
           activeMenu === "BOOKING" ? "Jadwal Booking Studio" : 
           "Rekapitulasi Data Disetujui"}
        </h2>

        {/* Tombol Export HANYA muncul di menu REKAP */}
        {activeMenu === "REKAP" && (
          <Button 
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 font-semibold"
          >
            <FileDown className="w-4 h-4" /> Export Excel
          </Button>
        )}
      </div>

      {/* ISI TABEL */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Mahasiswa</th>
              <th className="px-6 py-4">Program Studi</th>
              <th className="px-6 py-4">Tanggal Pengajuan</th>
              <th className="px-6 py-4">Status</th>
              {activeMenu !== "REKAP" && <th className="px-6 py-4 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Belum ada data di kategori ini.</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{item.user?.name || "Tanpa Nama"}</div>
                    <div className="text-xs text-slate-500">{item.user?.nim || "-"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-700">{item.user?.prodi || "-"}</div>
                    <div className="text-xs text-slate-500">{item.user?.fakultas || "-"} ({item.user?.angkatan || "-"})</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    {item.status === "PENDING" && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200"><Clock className="w-3.5 h-3.5"/> Menunggu</span>}
                    {item.status === "APPROVED" && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckCircle className="w-3.5 h-3.5"/> Disetujui</span>}
                    {item.status === "REJECTED" && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200"><XCircle className="w-3.5 h-3.5"/> Ditolak</span>}
                  </td>
                  
                  {/* Tombol Aksi (Hanya muncul jika bukan menu Rekap) */}
                  {activeMenu !== "REKAP" && (
                    <td className="px-6 py-4 text-center">
                      {item.status === "PENDING" ? (
                        <div className="flex justify-center gap-2">
                          <Button onClick={() => onUpdateStatus(item.id, "APPROVED")} size="sm" className="bg-emerald-100 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg h-8 px-3 text-xs transition-colors">Setuju</Button>
                          <Button onClick={() => onUpdateStatus(item.id, "REJECTED")} size="sm" className="bg-red-100 hover:bg-red-600 text-red-700 hover:text-white rounded-lg h-8 px-3 text-xs transition-colors">Tolak</Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Sudah diproses</span>
                      )}
                    </td>
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