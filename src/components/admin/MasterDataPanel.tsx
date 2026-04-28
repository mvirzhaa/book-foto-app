// src/components/admin/MasterDataPanel.tsx
import { Database, Plus, Trash2, GraduationCap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminMasterData } from "@/hooks/useMasterData";

export default function MasterDataPanel() {
  const { data, isLoading, handleAdd, handleDelete } = useAdminMasterData();

  if (isLoading) {
    return <div className="flex justify-center p-12 text-slate-400 animate-pulse font-medium">Memuat Master Data...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* KARTU 1: FAKULTAS & PRODI */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><GraduationCap className="w-5 h-5" /></div>
            <h2 className="font-bold text-lg text-slate-800">Data Fakultas & Program Studi</h2>
          </div>
          <Button onClick={() => handleAdd("FAKULTAS")} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 text-xs">
            <Plus className="w-4 h-4 mr-1" /> Tambah Fakultas
          </Button>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.fakultas.map((fak) => (
            <div key={fak.id} className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-800">{fak.nama}</h3>
                <button onClick={() => handleDelete("FAKULTAS", fak.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {fak.prodi.map((p) => (
                  <div key={p.id} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg text-sm">
                    <span className="text-slate-600 font-medium">{p.nama}</span>
                    <button onClick={() => handleDelete("PRODI", p.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              
<Button onClick={() => handleAdd("PRODI", fak.id)} variant="outline" size="sm" className="w-full mt-4 border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 rounded-xl h-8 text-xs">
  <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Prodi
</Button>
            </div>
          ))}
        </div>
      </div>

      {/* KARTU 2: ANGKATAN */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><Calendar className="w-5 h-5" /></div>
            <h2 className="font-bold text-lg text-slate-800">Tahun Angkatan</h2>
          </div>
          <Button onClick={() => handleAdd("ANGKATAN")} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-9 text-xs">
            <Plus className="w-4 h-4 mr-1" /> Tambah Angkatan
          </Button>
        </div>
        
        <div className="p-6 flex flex-wrap gap-3">
          {data.angkatan.map((angk) => (
            <div key={angk.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
              <span className="font-bold text-slate-700">{angk.tahun}</span>
              <button onClick={() => handleDelete("ANGKATAN", angk.id)} className="text-slate-400 hover:text-red-500 transition-colors ml-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}