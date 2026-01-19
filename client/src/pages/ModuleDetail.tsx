import { useParams, useLocation } from "wouter";
import { useModule } from "@/hooks/use-modules";
import { Layout } from "@/components/Layout";
import ReactPlayer from "react-player";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ModuleDetail() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const { data: module, isLoading } = useModule(Number(id));

  if (isLoading || !module) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLocation("/dashboard")}
            className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            {module.title}
          </h1>
        </div>

        {/* Video Player Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2rem] p-4 md:p-6 shadow-xl border-4 border-white ring-1 ring-gray-100"
        >
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
            <ReactPlayer 
              url={module.videoUrl} 
              width="100%" 
              height="100%" 
              controls={true}
              light={true} // Shows thumbnail first
            />
          </div>
        </motion.div>

        {/* Instruction Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 border-2 border-green-200 p-4 rounded-2xl flex items-center gap-4"
        >
          <div className="bg-green-500 p-2 rounded-xl text-white">
            <ArrowRight className="w-6 h-6" /> {/* Using ArrowRight as a fallback clapperboard-like icon or generic action icon */}
          </div>
          <p className="text-green-800 font-bold text-lg">
            Tonton video dengan seksama ya! Setelah selesai, kamu akan mengerjakan kuis.
          </p>
        </motion.div>

        {/* Action Bar */}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setLocation(`/module/${id}/quiz`)}
            className="px-12 py-5 bg-primary text-white text-2xl font-bold rounded-full shadow-lg shadow-primary/30 btn-push hover:brightness-110 flex items-center gap-3"
          >
            Lanjut ke Kuis <ArrowRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
