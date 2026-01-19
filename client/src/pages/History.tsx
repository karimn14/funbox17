import { useLocation } from "wouter";
import { getActiveStudent, useStudentHistory } from "@/hooks/use-students";
import { Layout } from "@/components/Layout";
import { Star, Calendar, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function History() {
  const [_, setLocation] = useLocation();
  const student = getActiveStudent();
  const { data: history, isLoading } = useStudentHistory(student?.id || 0);

  if (!student) {
    setLocation("/");
    return null;
  }

  const stats = history ? {
    count: history.length,
    average: Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / (history.length || 1)),
    best: Math.max(...history.map(h => h.score), 0)
  } : { count: 0, average: 0, best: 0 };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setLocation("/dashboard")}
            className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Riwayat Belajar
          </h1>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-blue-100 p-8 rounded-[2rem] border-4 border-blue-200 shadow-sm text-center">
            <div className="text-4xl font-black text-blue-600 mb-1">{stats.count}</div>
            <div className="font-bold text-blue-400 uppercase tracking-tighter">Total Percobaan</div>
          </div>
          <div className="bg-green-100 p-8 rounded-[2rem] border-4 border-green-200 shadow-sm text-center">
            <div className="text-4xl font-black text-green-600 mb-1">{stats.average}%</div>
            <div className="font-bold text-green-400 uppercase tracking-tighter">Rata-rata Nilai</div>
          </div>
          <div className="bg-yellow-100 p-8 rounded-[2rem] border-4 border-yellow-200 shadow-sm text-center">
            <div className="text-4xl font-black text-yellow-600 mb-1">{stats.best}%</div>
            <div className="font-bold text-yellow-400 uppercase tracking-tighter">Nilai Terbaik</div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-pulse text-2xl font-bold text-primary">Memuat Catatan...</div>
          </div>
        ) : history?.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-lg border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-600">Belum ada petualangan</h3>
            <p className="text-gray-400 mt-2">Ayo selesaikan modul pertamamu!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            <h2 className="text-xl font-display font-bold text-gray-500 mb-2">Daftar Riwayat Lengkap</h2>
            {history?.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-yellow-50 p-6 rounded-[2rem] shadow-sm border-2 border-yellow-100 flex items-center justify-between group hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-yellow-500 shadow-inner">
                    <Star className="w-10 h-10 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-2xl text-foreground leading-tight">{entry.moduleTitle}</h3>
                    <div className="flex items-center gap-2 text-gray-400 mt-1 font-bold">
                      <Calendar className="w-5 h-5" />
                      {new Date(entry.completedAt || "").toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="w-20 h-20 rounded-full border-4 border-yellow-200 flex items-center justify-center bg-white shadow-sm">
                  <span className="font-display font-black text-2xl text-yellow-600">{entry.score}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
