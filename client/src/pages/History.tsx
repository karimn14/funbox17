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
            Riwayat Petualangan
          </h1>
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
          <div className="grid gap-4">
            {history?.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-primary font-bold text-xl">
                    {entry.score}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{entry.moduleTitle}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1">
                  {[1, 2, 3].map((star) => (
                    <Star 
                      key={star}
                      className={`w-6 h-6 ${star <= entry.stars ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-100"}`}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
