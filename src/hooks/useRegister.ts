// src/hooks/useRegister.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Definisi tipe data agar tidak ada error merah dari TypeScript
type Prodi = { id: string; nama: string; fakultasId: string };
type Fakultas = { id: string; nama: string; prodi: Prodi[] };
type Angkatan = { id: string; tahun: string };

export function useRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk menyimpan Master Data dari database
  const [masterData, setMasterData] = useState<{ fakultas: Fakultas[]; angkatan: Angkatan[] }>({
    fakultas: [],
    angkatan: []
  });
  
  // State untuk menyimpan daftar Prodi yang aktif (tergantung Fakultas yang dipilih)
  const [availableProdi, setAvailableProdi] = useState<Prodi[]>([]);

  const [formData, setFormData] = useState({
    nim: "",
    name: "",
    fakultas: "",
    prodi: "",
    angkatan: "",
    password: "",
    confirmPassword: "",
  });

  // Tarik data dari API saat halaman pertama kali dibuka
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const res = await fetch("/api/master-data");
        const json = await res.json();
        if (json.success) {
          setMasterData(json.data);
        }
      } catch (error) {
        toast.error("Gagal memuat data Fakultas/Prodi.");
      }
    };
    fetchMasterData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));

    // Logika Cerdas: Jika user mengganti Fakultas, update daftar Prodi-nya
    if (name === "fakultas") {
      const selectedFakultas = masterData.fakultas.find(f => f.nama === value);
      setAvailableProdi(selectedFakultas ? selectedFakultas.prodi : []);
      
      // Reset pilihan prodi sebelumnya karena fakultasnya berubah
      setFormData(prev => ({ ...prev, prodi: "" })); 
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Oops! Password dan Konfirmasi Password tidak sama.");
      return;
    }

    if (!formData.fakultas || !formData.prodi || !formData.angkatan) {
      toast.error("Mohon lengkapi data Fakultas, Prodi, dan Angkatan.");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Menyiapkan akun Anda...");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nim: formData.nim,
          name: formData.name,
          fakultas: formData.fakultas,
          prodi: formData.prodi,
          angkatan: formData.angkatan,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success("Pendaftaran Berhasil! 🎉 Mengalihkan...");
        setFormData({ nim: "", name: "", fakultas: "", prodi: "", angkatan: "", password: "", confirmPassword: "" });
        
        setTimeout(() => {
          router.push("/login"); 
        }, 1500);
      } else {
        toast.dismiss(loadingToast);
        toast.error(`Gagal: ${data.message}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Terjadi kesalahan koneksi. Pastikan internet Anda lancar.");
    } finally {
      setIsLoading(false);
    }
  };

  // Jangan lupa 'export' state master data dan available prodi agar bisa dibaca komponen form
  return { formData, isLoading, masterData, availableProdi, handleChange, handleRegister };
}