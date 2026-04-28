// src/components/auth/RegisterForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterFormProps {
  formData: any;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RegisterForm({ formData, isLoading, handleChange, onSubmit }: RegisterFormProps) {
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
        <div className="space-y-2">
          <Label htmlFor="fakultas" className="text-slate-700">Fakultas</Label>
          <select id="fakultas" name="fakultas" required className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none h-11 rounded-xl px-3 text-sm appearance-none" value={formData.fakultas} onChange={handleChange}>
            <option value="" disabled>Pilih...</option>
            <option value="Teknik">Teknik</option>
            <option value="Ekonomi dan Bisnis">Ekonomi & Bisnis</option>
            <option value="Ilmu Komputer">Ilmu Komputer</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prodi" className="text-slate-700">Prodi</Label>
          <select id="prodi" name="prodi" required className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none h-11 rounded-xl px-3 text-sm appearance-none" value={formData.prodi} onChange={handleChange}>
            <option value="" disabled>Pilih...</option>
            <option value="Teknik Informatika">Teknik Informatika</option>
            <option value="Sistem Informasi">Sistem Informasi</option>
            <option value="Manajemen">Manajemen</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="angkatan" className="text-slate-700">Angkatan</Label>
          <select id="angkatan" name="angkatan" required className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none h-11 rounded-xl px-3 text-sm appearance-none" value={formData.angkatan} onChange={handleChange}>
            <option value="" disabled>Pilih...</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
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