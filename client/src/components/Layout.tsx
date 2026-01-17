import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LogOut, Home, History } from "lucide-react";
import { useLocation, Link } from "wouter";
import { getActiveStudent, clearActiveStudent } from "@/hooks/use-students";

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
  background?: string;
}

export function Layout({ children, showNav = true, background = "bg-[#E0F2FE]" }: LayoutProps) {
  const [_, setLocation] = useLocation();
  const student = getActiveStudent();

  const handleLogout = () => {
    clearActiveStudent();
    setLocation("/");
  };

  return (
    <div className={`min-h-screen ${background} font-sans relative overflow-hidden flex flex-col`}>
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      {showNav && student && (
        <nav className="relative z-10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm p-2 pr-6 rounded-full shadow-sm border border-white/50">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {student.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Halo, Pelajar!</p>
              <h2 className="text-sm font-bold text-foreground leading-tight">{student.name}</h2>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/dashboard">
              <button className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-primary hover:bg-primary hover:text-white">
                <Home className="w-6 h-6" />
              </button>
            </Link>
            <Link href="/history">
              <button className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-secondary hover:bg-secondary hover:text-white">
                <History className="w-6 h-6" />
              </button>
            </Link>
            <button 
              onClick={handleLogout}
              className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-destructive hover:bg-destructive hover:text-white"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="relative z-0 flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
