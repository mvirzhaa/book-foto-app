// src/components/admin/UserManagementPanel.tsx
import { Users, Trash2, KeyRound, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminUsers } from "@/hooks/useAdminUser";

export default function UserManagementPanel() {
  const { users, isLoading, handleDeleteUser, handleResetPassword } = useAdminUsers();

  if (isLoading) {
    return <div className="flex justify-center p-12 text-slate-400 animate-pulse font-medium">Memuat data pengguna...</div>;
  }

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-xl"><Users className="w-5 h-5" /></div>
          <h2 className="font-bold text-lg text-slate-800">Manajemen Akun Pengguna</h2>
        </div>
        <div className="text-sm font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
          Total: {users.length} Akun
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Mahasiswa / Pengguna</th>
              <th className="px-6 py-4">Program Studi</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    {u.name}
                    {u.role === "ADMIN" && <ShieldAlert className="w-4 h-4 text-amber-500" />}
                  </div>
                  <div className="text-xs text-slate-500">{u.nim}</div>
                </td>
                <td className="px-6 py-4">
                  {u.role === "ADMIN" ? (
                    <span className="text-slate-400 italic">Sistem Administrator</span>
                  ) : (
                    <>
                      <div className="font-medium text-slate-700">{u.prodi || "-"}</div>
                      <div className="text-xs text-slate-500">{u.fakultas || "-"} ({u.angkatan || "-"})</div>
                    </>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold tracking-wider ${
                    u.role === "ADMIN" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {u.nim !== "admin" ? (
                    <div className="flex justify-center gap-2">
                      <Button onClick={() => handleResetPassword(u.id, u.name)} size="sm" variant="outline" className="h-8 px-2 text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300" title="Reset Password">
                        <KeyRound className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDeleteUser(u.id, u.name)} size="sm" variant="outline" className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" title="Hapus Akun">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Protected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}