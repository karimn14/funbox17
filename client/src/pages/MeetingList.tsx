import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock, Play, Star, CheckCircle, Calendar } from "lucide-react";
import { useMeetings } from "@/hooks/use-meetings";
import { useModule } from "@/hooks/use-modules";
import { getActiveStudent } from "@/hooks/use-students";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useWebSerial } from "@/hooks/use-web-serial";
import { useEffect } from "react";

export default function MeetingList() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const student = getActiveStudent();
  const moduleId = Number(id);
  
  const { data: module, isLoading: moduleLoading } = useModule(moduleId);
  const { data: meetings, isLoading: meetingsLoading } = useMeetings(moduleId, student?.id);
  const { activeButton } = useWebSerial();

  // Redirect if not logged in
  if (!student) {
    setLocation("/");
    return null;
  }

  // Hardware button navigation
  useEffect(() => {
    if (activeButton !== null && activeButton !== undefined && meetings) {
      // Buttons 0-3 select meetings 1-4
      if (activeButton >= 0 && activeButton <= 3) {
        const meetingIndex = activeButton;
        const meeting = meetings[meetingIndex];
        
        if (meeting) {
          if (meeting.locked) {
            toast({
              title: "🔒 Pertemuan Terkunci!",
              description: "Selesaikan pertemuan sebelumnya dulu!",
              variant: "destructive",
            });
          } else {
            setLocation(`/module/${moduleId}/meeting/${meeting.id}`);
          }
        }
      }
    }
  }, [activeButton, meetings, moduleId]);

  if (moduleLoading || meetingsLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-bounce text-4xl font-display font-bold text-primary">
            Memuat...
          </div>
        </div>
      </Layout>
    );
  }

  if (!module) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-2xl text-muted-foreground">Module tidak ditemukan</div>
        </div>
      </Layout>
    );
  }

  const handleMeetingClick = (meeting: any) => {
    if (meeting.locked) {
      toast({
        title: "🔒 Pertemuan Terkunci!",
        description: "Selesaikan pertemuan sebelumnya dulu!",
        variant: "destructive",
      });
    } else {
      setLocation(`/module/${moduleId}/meeting/${meeting.id}`);
    }
  };

  const meetingColors = [
    { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", icon: "bg-red-500" },
    { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", icon: "bg-blue-500" },
    { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", icon: "bg-green-500" },
    { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", icon: "bg-yellow-500" },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display font-bold text-foreground">
            {module.title}
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            Pilih pertemuan untuk memulai belajar
          </p>
        </div>

        {/* Meeting Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {meetings?.map((meeting, index) => {
            const colors = meetingColors[index % meetingColors.length];
            const isLocked = meeting.locked;

            return (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative`}
              >
                <button
                  onClick={() => handleMeetingClick(meeting)}
                  disabled={isLocked}
                  className={`
                    w-full p-6 rounded-3xl border-4 shadow-xl
                    transition-all duration-300 btn-push
                    ${isLocked 
                      ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60' 
                      : `${colors.bg} ${colors.border} hover:scale-105`
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center
                      ${isLocked ? 'bg-gray-400' : colors.icon}
                      shadow-lg
                    `}>
                      {isLocked ? (
                        <Lock className="w-8 h-8 text-white" />
                      ) : (
                        <Calendar className="w-8 h-8 text-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <h3 className={`
                        text-2xl font-display font-bold
                        ${isLocked ? 'text-gray-600' : colors.text}
                      `}>
                        {meeting.title}
                      </h3>
                      <p className={`
                        text-sm font-body mt-1
                        ${isLocked ? 'text-gray-500' : 'text-muted-foreground'}
                      `}>
                        {isLocked ? '🔒 Selesaikan pertemuan sebelumnya' : 'Klik untuk mulai'}
                      </p>
                    </div>

                    {/* Status Badge */}
                    {!isLocked && (
                      <div className="flex items-center gap-2">
                        <Play className={`w-6 h-6 ${colors.text}`} />
                      </div>
                    )}
                  </div>
                </button>

                {/* Button Number Indicator (for hardware) */}
                {!isLocked && index < 4 && (
                  <div className={`
                    absolute -top-3 -right-3
                    w-10 h-10 rounded-full
                    ${colors.icon}
                    flex items-center justify-center
                    text-white font-bold text-lg
                    shadow-lg border-4 border-white
                  `}>
                    {index + 1}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Helper Text */}
        <div className="text-center text-muted-foreground text-sm font-body">
          💡 Tip: Gunakan tombol 1-4 pada FunBox untuk memilih pertemuan
        </div>
      </div>
    </Layout>
  );
}
