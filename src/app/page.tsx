// src/app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full max-w-3xl">
      <Card className="border-none shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-blue-900">
            Sistem Layanan Foto BPPSI UIKA
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Pendaftaran mudah untuk foto Ijazah dan Kartu Tanda Mahasiswa (KTM).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          {/* Nanti link ini akan kita arahkan ke halaman yang kita buat selanjutnya */}
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800">
              Daftar Mahasiswa Baru
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Login ke Akun
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}