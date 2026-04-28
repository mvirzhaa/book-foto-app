// src/hooks/useRegistrations.ts
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast"; // <-- Tambahkan import ini
import { Registration } from "@/types";

export function useRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRegistrations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/registrations");
      const data = await res.json();
      setRegistrations(data);
    } catch (error) {
      toast.error("Gagal mengambil data pendaftaran");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const updateStatus = async (id: string, newStatus: string) => {
    // KITA GANTI confirm() DENGAN CUSTOM TOAST INTERAKTIF
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px] p-1">
        <p className="text-sm font-medium text-slate-800">
          Yakin ingin mengubah status menjadi <span className="font-bold">{newStatus === "APPROVED" ? "DISETUJUI" : "DITOLAK"}</span>?
        </p>
        
        <div className="flex justify-end gap-2 mt-2">
          {/* Tombol Batal */}
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Batal
          </button>
          
          {/* Tombol Eksekusi */}
          <button 
            onClick={async () => {
              toast.dismiss(t.id); // Tutup dialog konfirmasi
              const loadingToast = toast.loading("Memperbarui status..."); 
              
              try {
                const res = await fetch("/api/admin/registrations", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id, status: newStatus }),
                });
                
                if (res.ok) {
                  await fetchRegistrations(); // Refresh data tabel
                  toast.success("Status berhasil diperbarui!", { id: loadingToast });
                } else {
                  toast.error("Gagal memperbarui status", { id: loadingToast });
                }
              } catch (error) {
                toast.error("Terjadi kesalahan jaringan", { id: loadingToast });
              }
            }} 
            className={`px-4 py-2 text-white rounded-lg text-xs font-semibold transition-colors ${
              newStatus === "APPROVED" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    ), {
      duration: Infinity, // Toast diam di layar sampai user memilih
      position: "top-center",
    });
  };

  return { registrations, isLoading, updateStatus };
}