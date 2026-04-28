// src/hooks/useRegister.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nim: "",
    name: "",
    fakultas: "",
    prodi: "",
    angkatan: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          router.push("/login"); // Sesuai catatan Anda, ini diarahkan ke halaman login
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

  return { formData, isLoading, handleChange, handleRegister };
}