// src/hooks/useRegistrations.ts
import { useState, useEffect, useCallback } from "react";
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
      console.error("Gagal mengambil data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const updateStatus = async (id: string, newStatus: string) => {
    if (!confirm(`Yakin ingin mengubah status menjadi ${newStatus}?`)) return false;
    
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      if (res.ok) {
        await fetchRegistrations(); // Refresh data otomatis
        return true;
      }
      return false;
    } catch (error) {
      console.error("Kesalahan jaringan:", error);
      return false;
    }
  };

  return { registrations, isLoading, updateStatus };
}