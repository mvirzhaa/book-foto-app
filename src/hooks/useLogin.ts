// src/hooks/useLogin.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ nim: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nim || !formData.password) {
      toast.error("Mohon isi NIM dan Password.");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Memverifikasi akun...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        
        // Simpan data user di localStorage agar bisa dibaca halaman lain (opsional tapi disarankan)
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success(`Selamat datang, ${data.user.name}!`);
        
        // LOGIKA RBAC: Arahkan ke halaman yang tepat berdasarkan ROLE
        setTimeout(() => {
          if (data.user.role === "ADMIN") {
            router.push("/admin"); // Admin dilempar ke Pusat Kendali
          } else {
            router.push("/dashboard"); // Mahasiswa dilempar ke Dashboard biasa
          }
        }, 1500);

      } else {
        toast.dismiss(loadingToast);
        toast.error(`Gagal: ${data.message}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Gagal terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, isLoading, handleChange, handleLogin };
}