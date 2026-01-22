import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Play, Star, BookOpen, MessageCircle, Usb } from "lucide-react";
import { useModules } from "@/hooks/use-modules";
import { getActiveStudent, useStudentHistory } from "@/hooks/use-students";
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useSerial } from "@/context/SerialContext";

export default function Dashboard() {
  const [_, setLocation] = useLocation();
  const { data: modules, isLoading } = useModules();
  const student = getActiveStudent();
  const { data: history } = useStudentHistory(student?.id || 0);
  const [showReport, setShowReport] = useState(false);
  
  // Get serial connection status
  const { isConnected, connect } = useSerial();

  // Redirect if not logged in
  if (!student) {
    setLocation("/");
    return null;
  }

  const getSmartFeedback = () => {
    if (!history || !modules || history.length === 0) return null;
    
    // Check if all unique modules have been attempted at least once
    const attemptedModuleIds = new Set(history.map(h => h.moduleId));
    const allCompleted = modules.every(m => attemptedModuleIds.has(m.id));

    if (!allCompleted) return null;

    // Logic: Identify module with lowest average score
    const moduleStats = modules.map(m => {
      const results = history.filter(h => h.moduleId === m.id);
      const avg = results.reduce((acc, curr) => acc + curr.score, 0) / results.length;
      return { id: m.id, title: m.title, avg };
    });

    const best = [...moduleStats].sort((a, b) => b.avg - a.avg)[0];
    const worst = [...moduleStats].sort((a, b) => a.avg - b.avg)[0];

    return { best, worst };
  };

  const feedback = getSmartFeedback();

  const cardColors = [
    "bg-pink-100 text-pink-700 border-pink-200",
    "bg-teal-100 text-teal-700 border-teal-200",
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-orange-100 text-orange-700 border-orange-200",
  ];

  const iconColors = [
    "bg-pink-500",
    "bg-teal-500",
    "bg-purple-500",
    "bg-orange-500",
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-bounce text-4xl font-display font-bold text-primary">Memuat...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-display font-bold text-foreground">
              Pilih Petualanganmu!
            </h1>
            <p className="text-lg text-muted-foreground font-body">
              Ayo belajar hal baru hari ini. Pilih salah satu modul di bawah.
            </p>
          </div>

          <div className="flex gap-3">
            {/* USB Connection Button */}
            {isConnected ? (
              <div className="bg-green-500 text-white font-bold px-6 py-4 rounded-3xl shadow-lg flex items-center gap-3">
                <Usb className="w-6 h-6" />
                USB Terhubung 
              </div>
            ) : (
              <button
                onClick={connect}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-4 rounded-3xl shadow-lg btn-push flex items-center gap-3"
              >
                <Usb className="w-6 h-6" />
                Hubungkan USB
              </button>
            )}

            {/* Smart Report Button */}
            {feedback && (
              <button
                onClick={() => setShowReport(true)}
                className="bg-yellow-400 text-yellow-950 font-black px-6 py-4 rounded-3xl shadow-lg shadow-yellow-400/20 btn-push flex items-center gap-3 text-lg"
              >
                <MessageCircle className="w-6 h-6" /> Laporan Pintar
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules?.map((module, index) => {
            const colorClass = cardColors[index % cardColors.length];
            const iconBgClass = iconColors[index % iconColors.length];

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`rounded-[2.5rem] p-8 border-4 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden ${colorClass}`}
                onClick={() => setLocation(`/module/${module.id}/meetings`)}
              >
                {/* Decorative Icon Background */}
                <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10 ${iconBgClass}`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-black uppercase tracking-widest">
                      {module.category}
                    </span>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md ${iconBgClass}`}>
                      <BookOpen className="w-7 h-7" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-display font-bold mb-4 pr-4 leading-tight">
                    {module.title}
                  </h3>
                  
                  <div className="mt-auto pt-8 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-lg font-black opacity-80">
                      <Star className="w-5 h-5 fill-current" />
                      <span>Seru!</span>
                    </div>
                    <button className="px-8 py-3 bg-white rounded-2xl shadow-sm text-lg font-black group-hover:scale-105 transition-transform flex items-center gap-2">
                      Mulai <Play className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Laporan Modal */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="rounded-[3rem] p-12 max-w-2xl border-none">
          <DialogHeader className="text-center">
            <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <MessageCircle className="w-12 h-12" />
            </div>
            <DialogTitle className="text-4xl font-display font-black text-foreground mb-4">Laporan Belajarmu</DialogTitle>
            <DialogDescription className="text-xl font-body text-gray-600 leading-relaxed">
              Wah, kamu sudah mencoba semua modul! Ini hasil analisanya:
            </DialogDescription>
          </DialogHeader>

          {feedback && (
            <div className="mt-8 space-y-6">
              <div className="bg-green-50 p-8 rounded-[2rem] border-2 border-green-100">
                <p className="text-green-800 text-xl font-body">
                  <span className="font-black text-2xl block mb-2">Hebat! 🌟</span>
                  Kamu paling jago di <span className="font-black underline">{feedback.best.title}</span>. Teruskan semangatmu ya!
                </p>
              </div>

              <div className="bg-pink-50 p-8 rounded-[2rem] border-2 border-pink-100">
                <p className="text-pink-800 text-xl font-body">
                  <span className="font-black text-2xl block mb-2">Ayo Semangat! 💪</span>
                  Sepertinya kamu perlu latihan lagi di <span className="font-black underline">{feedback.worst.title}</span> agar nilaimu semakin bagus.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowReport(false)}
            className="w-full mt-8 py-5 bg-primary text-white text-2xl font-black rounded-[2rem] shadow-lg shadow-primary/20 btn-push"
          >
            Siap, Belajar Lagi!
          </button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
