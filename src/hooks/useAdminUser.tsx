// src/hooks/useAdminUsers.ts
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

type User = {
  id: string; nim: string; name: string; role: string;
  fakultas: string; prodi: string; angkatan: string; createdAt: string;
};

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (json.success) setUsers(json.data);
    } catch (error) {
      toast.error("Gagal memuat daftar akun.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Hapus Akun dengan Konfirmasi
  const handleDeleteUser = (id: string, name: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px] p-1">
        <p className="text-sm font-medium text-slate-800">
          Yakin ingin menghapus akun <b>{name}</b> secara permanen?
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold">Batal</button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Menghapus akun...");
              try {
                const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
                const json = await res.json();
                if (res.ok && json.success) {
                  await fetchUsers();
                  toast.success("Akun berhasil dihapus!", { id: loadingToast });
                } else {
                  toast.error(json.message || "Gagal menghapus", { id: loadingToast });
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

  // Reset Password dengan Konfirmasi
  const handleResetPassword = (id: string, name: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[280px] p-1">
        <p className="text-sm font-medium text-slate-800">
          Reset password untuk <b>{name}</b> menjadi <br/><code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600">12345678</code> ?
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold">Batal</button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Mereset password...");
              try {
                const res = await fetch(`/api/users`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id })
                });
                const json = await res.json();
                if (res.ok && json.success) {
                  toast.success(json.message, { id: loadingToast, duration: 4000 });
                } else {
                  toast.error("Gagal mereset", { id: loadingToast });
                }
              } catch (e) {
                toast.error("Error jaringan", { id: loadingToast });
              }
            }} 
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold"
          >
            Ya, Reset
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: "top-center" });
  };

  return { users, isLoading, handleDeleteUser, handleResetPassword };
}