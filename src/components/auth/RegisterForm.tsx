// src/components/auth/RegisterForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Perbarui interface agar sesuai dengan props baru yang dilempar dari parent
interface RegisterFormProps {
  formData: any;
  isLoading: boolean;
  masterData: { fakultas: any[]; angkatan: any[] };
  availableProdi: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RegisterForm({ formData, isLoading, masterData, availableProdi, handleChange, onSubmit }: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nim" className="text-slate-700">Nomor Induk Mahasiswa</Label>
          <Input id="nim" name="nim" placeholder="2026xxxx" required className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-11 rounded-xl" value={formData.nim} onChange={handleChange} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700">Nama Lengkap</Label>
          <Input id="name" name="name" placeholder="Sesuai SIAKAD" required className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-11 rounded-xl" value={formData.name} onChange={handleChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* DROPDOWN FAKULTAS DINAMIS */}
        <div className="space-y-2">
          <Label htmlFor="fakultas" className="text-slate-700">Fakultas</Label>
          <select id="fakultas" name="fakultas" required className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none h-11 rounded-xl px-3 text-sm appearance-none" value={formData.fakultas} onChange={handleChange}>
            <option value="" disabled>Pilih...</option>
            {masterData.fakultas.map((fak) => (
              <option key={fak.id} value={fak.nama}>{fak.nama}</option>
            ))}
          </select>
        </div>

        {/* DROPDOWN PRODI DINAMIS (CERDAS) */}
        <div className="space-y-2">
          <Label htmlFor="prodi" className="text-slate-700">Prodi</Label>
          <select id="prodi" name="prodi" required disabled={!formData.fakultas} className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none h-11 rounded-xl px-3 text-sm appearance-none disabled:opacity-50 disabled:cursor-not-allowed" value={formData.prodi} onChange={handleChange}>
            <option value="" disabled>{formData.fakultas ? "Pilih Prodi..." : "Pilih Fakultas Dulu"}</option>
            {availableProdi.map((prodi) => (
              <option key={prodi.id} value={prodi.nama}>{prodi.nama}</option>
            ))}
          </select>
        </div>

        {/* DROPDOWN ANGKATAN DINAMIS */}
        <div className="space-y-2">
          <Label htmlFor="angkatan" className="text-slate-700">Angkatan</Label>
          <select id="angkatan" name="angkatan" required className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none h-11 rounded-xl px-3 text-sm appearance-none" value={formData.angkatan} onChange={handleChange}>
            <option value="" disabled>Pilih...</option>
            {masterData.angkatan.map((angk) => (
              <option key={angk.id} value={angk.tahun}>{angk.tahun}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700">Password</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-11 rounded-xl" value={formData.password} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-slate-700">Konfirmasi</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-11 rounded-xl" value={formData.confirmPassword} onChange={handleChange} />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-semibold mt-2 transition-all hover:shadow-lg hover:shadow-blue-600/30">
        {isLoading ? "Memproses..." : "Buat Akun Saya"}
      </Button>
    </form>
  );
}