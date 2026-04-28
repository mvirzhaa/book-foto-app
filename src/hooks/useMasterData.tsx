// src/hooks/useAdminMasterData.ts
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

type Prodi = { id: string; nama: string; fakultasId: string };
type Fakultas = { id: string; nama: string; prodi: Prodi[] };
type Angkatan = { id: string; tahun: string };

export function useAdminMasterData() {
  const [data, setData] = useState<{ fakultas: Fakultas[]; angkatan: Angkatan[] }>({
    fakultas: [], angkatan: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchMasterData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/master-data");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (error) {
      toast.error("Gagal mengambil Master Data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMasterData(); }, [fetchMasterData]);

  // Fungsi internal untuk mengeksekusi API POST
  const submitData = async (input: string, type: "FAKULTAS" | "PRODI" | "ANGKATAN", parentId?: string, toastId?: string) => {
    if (toastId) toast.dismiss(toastId); // Tutup toast input
    const loadingToast = toast.loading("Menyimpan data...");
    
    try {
      const body = type === "PRODI" 
        ? { type, nama: input, fakultasId: parentId } 
        : type === "ANGKATAN" ? { type, tahun: input } : { type, nama: input };

      const res = await fetch("/api/master-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        await fetchMasterData(); // Refresh tabel otomatis
        toast.success("Berhasil ditambahkan!", { id: loadingToast });
      } else {
        toast.error("Gagal menyimpan data", { id: loadingToast });
      }
    } catch (e) {
      toast.error("Kesalahan jaringan", { id: loadingToast });
    }
  };

  // FUNGSI TAMBAH DATA (DENGAN TOAST INPUT CUSTOM)
  const handleAdd = (type: "FAKULTAS" | "PRODI" | "ANGKATAN", parentId?: string) => {
    const title = type === "FAKULTAS" ? "Tambah Fakultas Baru" : type === "PRODI" ? "Tambah Prodi Baru" : "Tambah Angkatan Baru";
    const placeholder = type === "ANGKATAN" ? "Contoh: 2027" : "Masukkan nama...";

    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[280px] p-1">
        <p className="text-sm font-bold text-slate-800">{title}</p>
        
        <input
          id={`input-${t.id}`}
          type="text"
          autoFocus
          placeholder={placeholder}
          className="w-full border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none h-10 rounded-xl px-3 text-sm transition-all"
          onKeyDown={(e) => {
            // Bisa langsung tekan Enter untuk simpan
            if (e.key === 'Enter') {
              const val = (e.currentTarget as HTMLInputElement).value;
              if (val.trim()) submitData(val.trim(), type, parentId, t.id);
            }
          }}
        />
        
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors">
            Batal
          </button>
          <button 
            onClick={() => {
              const val = (document.getElementById(`input-${t.id}`) as HTMLInputElement).value;
              if (val.trim()) {
                submitData(val.trim(), type, parentId, t.id);
              } else {
                toast.error("Input tidak boleh kosong!");
              }
            }} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Simpan
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: "top-center" });
  };

  // FUNGSI HAPUS DATA (DENGAN KONFIRMASI)
  const handleDelete = (type: "FAKULTAS" | "PRODI" | "ANGKATAN", id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px] p-1">
        <p className="text-sm font-medium text-slate-800">
          Yakin ingin menghapus data ini?
          {type === "FAKULTAS" && <span className="block text-xs text-red-500 mt-1 font-bold">Awas: Semua Prodi di dalamnya juga akan ikut terhapus!</span>}
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold">Batal</button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Menghapus...");
              try {
                const res = await fetch(`/api/master-data?type=${type}&id=${id}`, { method: "DELETE" });
                if (res.ok) {
                  await fetchMasterData();
                  toast.success("Berhasil dihapus!", { id: loadingToast });
                } else {
                  toast.error("Gagal menghapus", { id: loadingToast });
                }
              } catch (e) {
                toast.error("Error jaringan", { id: loadingToast });
              }
            }} 
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: "top-center" });
  };

  return { data, isLoading, handleAdd, handleDelete };
}