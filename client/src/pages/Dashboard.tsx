import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Play, Star, BookOpen } from "lucide-react";
import { useModules } from "@/hooks/use-modules";
import { getActiveStudent } from "@/hooks/use-students";
import { Layout } from "@/components/Layout";

export default function Dashboard() {
  const [_, setLocation] = useLocation();
  const { data: modules, isLoading } = useModules();
  const student = getActiveStudent();

  // Redirect if not logged in
  if (!student) {
    setLocation("/");
    return null;
  }

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
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display font-bold text-foreground">
            Pilih Petualanganmu!
          </h1>
          <p className="text-lg text-muted-foreground">
            Ayo belajar hal baru hari ini. Pilih salah satu modul di bawah.
          </p>
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
                className={`rounded-3xl p-6 border-4 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden ${colorClass}`}
                onClick={() => setLocation(`/module/${module.id}`)}
              >
                {/* Decorative Icon Background */}
                <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10 ${iconBgClass}`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider">
                      {module.category}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${iconBgClass}`}>
                      <BookOpen className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-display font-bold mb-2 pr-4 leading-tight">
                    {module.title}
                  </h3>
                  
                  <div className="mt-auto pt-6 flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm font-bold opacity-70">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Seru!</span>
                    </div>
                    <button className="px-6 py-2 bg-white rounded-xl shadow-sm text-sm font-bold group-hover:scale-105 transition-transform flex items-center gap-2">
                      Mulai <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
