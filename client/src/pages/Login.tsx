import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useStudentLogin } from "@/hooks/use-students";
import { Layout } from "@/components/Layout";
import { Sparkles, GraduationCap, Lock } from "lucide-react";

export default function Login() {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [_, setLocation] = useLocation();
  const loginMutation = useStudentLogin();
  const [adminMode, setAdminMode] = useState(false);
  const [adminPin, setAdminPin] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !className) return;

    try {
      await loginMutation.mutateAsync({ name, className });
      setLocation("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === "1234") {
      setLocation("/admin");
    } else {
      alert("PIN Salah!");
    }
  };

  return (
    <Layout showNav={false}>
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
        {/* Admin Toggle */}
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => setAdminMode(!adminMode)}
            className="text-muted-foreground/30 hover:text-primary transition-colors p-2"
          >
            <Lock className="w-5 h-5" />
          </button>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-4 border-white ring-4 ring-primary/20 text-center relative overflow-hidden">
            {/* Header Graphics */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-tr from-primary to-purple-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/30 text-white">
                <GraduationCap className="w-12 h-12" />
              </div>

              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                {adminMode ? "Admin Guru" : "Mulai Belajar!"}
              </h1>
              <p className="text-muted-foreground mb-8">
                {adminMode ? "Masuk ke panel kontrol" : "Masukkan namamu untuk memulai petualangan seru."}
              </p>

              {adminMode ? (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="text-left">
                    <label className="text-sm font-bold text-gray-600 ml-4 mb-1 block">PIN Guru</label>
                    <input
                      type="password"
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg text-center tracking-widest"
                      placeholder="****"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 mt-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 btn-push hover:brightness-110"
                  >
                    Masuk Admin
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="text-left">
                    <label className="text-sm font-bold text-gray-600 ml-4 mb-1 block">Nama Lengkap</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-display text-lg"
                      placeholder="Contoh: Budi Santoso"
                    />
                  </div>

                  <div className="text-left">
                    <label className="text-sm font-bold text-gray-600 ml-4 mb-1 block">Kelas</label>
                    <select
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-display text-lg appearance-none"
                    >
                      <option value="" disabled>Pilih Kelas...</option>
                      <option value="1A">Kelas 1A</option>
                      <option value="1B">Kelas 1B</option>
                      <option value="2A">Kelas 2A</option>
                      <option value="2B">Kelas 2B</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full py-4 bg-gradient-to-r from-primary to-pink-500 text-white font-bold text-xl rounded-2xl shadow-lg shadow-primary/30 btn-push hover:brightness-110 flex items-center justify-center gap-2 group"
                  >
                    {loginMutation.isPending ? (
                      "Memuat..."
                    ) : (
                      <>
                        Mulai Petualangan <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
