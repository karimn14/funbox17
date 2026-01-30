import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { Layout } from "@/components/Layout";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, AlertTriangle, CheckCircle2, TrendingUp, Calendar, Trophy, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { apiFetch } from "@/lib/api-client";
import { useEffect, useRef, useMemo } from "react";
import { KKM_STANDARDS, getScoreColorClass, MODULE_CONFIG } from "@shared/module-config";

// Module names mapping (from MODULE_CONFIG)
const MODULE_NAMES: Record<number, string> = {
  1: "Pengenalan Uang & Berhitung",
  2: "Keterampilan Bertahan Hidup",
  3: "Kesehatan & Kebersihan",
  4: "Bahasa Indonesia & Literasi"
};

interface ModuleSummary {
  moduleId: number;
  moduleName: string;
  meetingsCompleted: number;
  totalMeetings: number;
  averageScore: number;
  status: "Lulus" | "Remedial";
}

export default function StudentReport() {
  const params = useParams();
  const studentId = Number(params.id);
  const [_, setLocation] = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: report, isLoading } = useQuery({
    queryKey: ["studentReport", studentId],
    queryFn: async () => {
      const url = buildUrl(api.students.getReport.path, { id: studentId });
      const res = await apiFetch(url);
      if (!res.ok) throw new Error("Failed to fetch report");
      return api.students.getReport.responses[200].parse(await res.json());
    },
  });

  // Calculate module summaries with STRICT logic
  const moduleSummaries = useMemo<ModuleSummary[]>(() => {
    if (!report || report.activities.length === 0) return [];

    const moduleData: Record<number, { scores: number[]; count: number; moduleName: string }> = {};

    // Initialize all 4 modules
    for (let i = 1; i <= 4; i++) {
      moduleData[i] = {
        scores: [],
        count: 0,
        moduleName: MODULE_NAMES[i] || `Module ${i}`
      };
    }

    // Group activities by module
    report.activities.forEach(activity => {
      // Extract module ID from module name (assuming format like "Pengenalan Uang & Berhitung")
      let moduleId = Object.entries(MODULE_NAMES).find(
        ([_, name]) => activity.module === name
      )?.[0];
      
      if (moduleId) {
        const id = Number(moduleId);
        moduleData[id].scores.push(activity.score);
        moduleData[id].count++;
      }
    });

    // Calculate summaries for all modules
    return Object.entries(moduleData).map(([moduleId, data]) => {
      const id = Number(moduleId);
      const totalMeetings = 4; // ALWAYS 4 meetings per module
      
      // CRITICAL: Average is ALWAYS divided by 4, not by completed count
      // If only 2 meetings done, we sum those 2 and divide by 4
      const scoreSum = data.scores.reduce((sum, score) => sum + score, 0);
      const averageScore = totalMeetings > 0 ? Math.round(scoreSum / totalMeetings) : 0;
      
      return {
        moduleId: id,
        moduleName: data.moduleName,
        meetingsCompleted: data.count,
        totalMeetings,
        averageScore,
        status: (averageScore >= KKM_STANDARDS.MODULE ? "Lulus" : "Remedial") as "Lulus" | "Remedial"
      };
    }).sort((a, b) => a.moduleId - b.moduleId);
  }, [report]);

  // Identify ALL failed modules (not just one)
  const failedModules = useMemo(() => {
    return moduleSummaries
      .filter(m => m.averageScore < KKM_STANDARDS.MODULE)
      .map(m => m.moduleName);
  }, [moduleSummaries]);

  // Calculate overall average
  const overallAverage = useMemo(() => {
    if (moduleSummaries.length === 0) return 0;
    const sum = moduleSummaries.reduce((acc, m) => acc + m.averageScore, 0);
    return Math.round(sum / moduleSummaries.length);
  }, [moduleSummaries]);

  // Play audio when report loads (based on overall pass/fail)
  useEffect(() => {
    if (report && moduleSummaries.length > 0) {
      const allPassed = failedModules.length === 0;
      const audioPath = allPassed
        ? '/assets/audio/happy-result.mp3' 
        : '/assets/audio/sad-result.mp3';
      
      audioRef.current = new Audio(audioPath);
      audioRef.current.play().catch(() => console.log('Module completion audio failed'));
      
      // Cleanup
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [report, moduleSummaries, failedModules]);

  if (isLoading) {
    return (
      <Layout showNav={false} background="bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat laporan...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!report) {
    return (
      <Layout showNav={false} background="bg-gray-50">
        <div className="text-center py-12">
          <p className="text-gray-600">Laporan tidak ditemukan</p>
        </div>
      </Layout>
    );
  }

  const today = new Date();

  return (
    <Layout showNav={false} background="bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        {/* Back Button */}
        <button
          onClick={() => setLocation("/admin")}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali ke Dashboard</span>
        </button>

        {/* Report Header - Formal Style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="border-b-2 border-gray-900 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
              LAPORAN PERKEMBANGAN SISWA
            </h1>
            <p className="text-center text-gray-600 text-sm">
              FunBox Learning Platform - Sistem Pembelajaran Interaktif
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Nama Siswa:</p>
              <p className="font-bold text-gray-900 text-lg">{report.student.name}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Kelas:</p>
              <p className="font-bold text-gray-900 text-lg">{report.student.className || "-"}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Guru Pendamping:</p>
              <p className="font-bold text-gray-900 text-lg">{report.student.teacherName || "-"}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Tanggal Laporan:</p>
              <p className="font-semibold text-gray-900">
                {format(today, "dd MMMM yyyy", { locale: localeId })}
              </p>
            </div>
          </div>

          {/* Module Summary Table */}
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Per Modul</h3>
            
            {moduleSummaries.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Belum ada data pembelajaran</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="py-3 px-4 text-sm font-bold text-gray-700 uppercase">Nama Modul</th>
                    <th className="py-3 px-4 text-sm font-bold text-gray-700 uppercase text-center">Progress</th>
                    <th className="py-3 px-4 text-sm font-bold text-gray-700 uppercase text-center">Rata-rata</th>
                    <th className="py-3 px-4 text-sm font-bold text-gray-700 uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {moduleSummaries.map((module) => (
                    <tr key={module.moduleId} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {module.moduleName}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        <span className="font-semibold">
                          {module.meetingsCompleted}/{module.totalMeetings}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">Pertemuan</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-3 py-1 text-lg font-bold ${
                          module.averageScore >= KKM_STANDARDS.MODULE 
                            ? 'text-green-700' 
                            : 'text-red-700'
                        }`}>
                          {module.averageScore}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                          module.status === "Lulus"
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}>
                          {module.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-300 bg-gray-50">
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-900" colSpan={2}>
                      RATA-RATA KESELURUHAN
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-3 py-1 text-lg font-bold ${
                        overallAverage >= KKM_STANDARDS.MODULE 
                          ? 'text-green-700' 
                          : 'text-red-700'
                      }`}>
                        {overallAverage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                        overallAverage >= KKM_STANDARDS.MODULE
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}>
                        {overallAverage >= KKM_STANDARDS.MODULE ? "Lulus" : "Remedial"}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
            
            {/* KKM Reference */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-bold">Catatan:</span> Standar kelulusan modul (KKM) adalah <span className="font-bold">{KKM_STANDARDS.MODULE}</span>. 
                Rata-rata dihitung dari jumlah semua nilai pertemuan dibagi 4 (total pertemuan per modul).
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Aktivitas Pembelajaran */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Aktivitas Pembelajaran</h2>
          </div>

          {report.activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada aktivitas pembelajaran yang tercatat.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Nama Modul
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Nama Pertemuan
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider text-center">
                      Skor
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {report.activities.map((activity, index) => {
                    const scoreColorClass = getScoreColorClass(activity.score, false);

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600 font-medium">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{activity.module}</td>
                        <td className="px-4 py-3 text-gray-700">{activity.meeting}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {activity.date ? format(new Date(activity.date), "dd/MM/yyyy", { locale: localeId }) : "-"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${scoreColorClass}`}>
                            {activity.score}
                            {activity.score >= KKM_STANDARDS.MEETING ? " ✓" : " ⚠"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 2: Analisis Perkembangan & Rekomendasi */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Analisis Perkembangan & Rekomendasi</h2>
          </div>

          {/* Comprehensive Feedback */}
          {failedModules.length > 0 ? (
            <div className="p-6 bg-white border-2 border-red-600 rounded-lg mb-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-900 mb-3">
                    PERINGATAN AKADEMIK
                  </h3>
                  <div className="space-y-3 text-gray-800">
                    <p className="leading-relaxed">
                      Kepada Yth. Orang Tua/Wali dari <span className="font-bold text-gray-900">{report?.student.name}</span>,
                    </p>
                    <p className="leading-relaxed">
                      Berdasarkan hasil evaluasi pembelajaran yang telah dilakukan, dengan ini kami menyampaikan bahwa 
                      siswa memerlukan <span className="font-bold text-red-900">PENGULANGAN MATERI</span> pada modul berikut:
                    </p>
                    
                    {/* List ALL failed modules */}
                    <div className="my-4 p-4 bg-red-50 border-l-4 border-red-600 rounded">
                      <ul className="space-y-2">
                        {failedModules.map((moduleName, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-600 font-bold mt-0.5">•</span>
                            <span className="text-gray-900 font-semibold">{moduleName}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <p className="leading-relaxed">
                      Nilai rata-rata siswa pada {failedModules.length === 1 ? 'modul tersebut' : 'modul-modul tersebut'} berada 
                      di bawah standar kelulusan modul (KKM {KKM_STANDARDS.MODULE}). Kami merekomendasikan agar siswa melakukan 
                      pengulangan materi untuk memastikan pemahaman yang lebih baik sebelum melanjutkan ke tahap pembelajaran berikutnya.
                    </p>
                    
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded">
                      <p className="text-sm text-yellow-900">
                        <span className="font-bold">Saran Tindakan:</span> Siswa disarankan untuk mengulang seluruh pertemuan dalam modul yang belum lulus, 
                        mengerjakan latihan tambahan, dan berkonsultasi dengan guru pendamping.
                      </p>
                    </div>
                    
                    <p className="mt-4 text-sm text-gray-600">
                      Hormat kami,<br />
                      <span className="font-bold text-gray-900">Tim Pengajar FunBox</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-white border-2 border-green-600 rounded-lg mb-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-green-900 mb-3">
                    PERFORMA SANGAT BAIK
                  </h3>
                  <p className="text-gray-800 leading-relaxed mb-3">
                    Selamat! Siswa <span className="font-bold text-gray-900">{report?.student.name}</span> telah menyelesaikan 
                    seluruh modul pembelajaran dengan baik dan memenuhi standar kelulusan. Semua modul berhasil diselesaikan 
                    dengan nilai rata-rata di atas KKM {KKM_STANDARDS.MODULE}.
                  </p>
                  <div className="p-4 bg-green-50 border border-green-300 rounded">
                    <p className="text-sm text-green-900">
                      <span className="font-bold">Rekomendasi:</span> Siswa dapat melanjutkan ke materi pembelajaran tingkat lanjut. 
                      Pertahankan konsistensi belajar dan terus kembangkan pemahaman pada setiap topik.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Strength */}
          {report?.analysis.strength && (
            <div className="mb-6 p-4 bg-white border border-blue-300 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">Kekuatan (Strength)</h3>
                  <p className="text-gray-800">
                    Siswa menunjukkan performa sangat menonjol di bagian <span className="font-bold text-blue-900">{report.analysis.strength}</span>. 
                    Pertahankan dan kembangkan kemampuan ini lebih lanjut.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Laporan ini dibuat secara otomatis oleh sistem FunBox Learning Platform. 
              Untuk informasi lebih lanjut, silakan hubungi guru/pengajar yang bersangkutan.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
