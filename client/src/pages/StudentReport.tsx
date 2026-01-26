import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { Layout } from "@/components/Layout";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, AlertTriangle, CheckCircle2, TrendingUp, Calendar, Trophy } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function StudentReport() {
  const params = useParams();
  const studentId = Number(params.id);
  const [_, setLocation] = useLocation();

  const { data: report, isLoading } = useQuery({
    queryKey: ["studentReport", studentId],
    queryFn: async () => {
      const url = buildUrl(api.students.getReport.path, { id: studentId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch report");
      return api.students.getReport.responses[200].parse(await res.json());
    },
  });

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
                    const scoreColor = 
                      activity.score >= 80 ? "text-green-600 bg-green-50" :
                      activity.score >= 60 ? "text-yellow-600 bg-yellow-50" :
                      "text-red-600 bg-red-50";

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
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${scoreColor}`}>
                            {activity.score}
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

        {/* Section 2: Analisis Perkembangan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Analisis Perkembangan</h2>
          </div>

          {/* Performance Strength */}
          {report.analysis.strength && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">Kekuatan (Strength)</h3>
                  <p className="text-blue-800">
                    Siswa menunjukkan performa sangat menonjol di bagian <span className="font-bold">{report.analysis.strength}</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recommendation Logic */}
          {report.analysis.needsRepeat ? (
            <div className="p-6 bg-red-50 border-2 border-red-600 rounded-lg">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-900 mb-3 uppercase">
                    PERINGATAN AKADEMIK
                  </h3>
                  <div className="space-y-2 text-red-800">
                    <p className="font-medium leading-relaxed">
                      Kepada Yth. Orang Tua/Wali dari <span className="font-bold">{report.student.name}</span>,
                    </p>
                    <p className="leading-relaxed">
                      Berdasarkan hasil evaluasi pembelajaran yang telah dilakukan, dengan ini kami menyampaikan bahwa siswa tersebut 
                      <span className="font-bold"> memerlukan PENGULANGAN MATERI</span> pada modul:
                    </p>
                    <div className="my-3 p-4 bg-white border-l-4 border-red-600 rounded">
                      <p className="text-lg font-bold text-red-900">
                         {report.analysis.repeatModuleName}
                      </p>
                    </div>
                    <p className="leading-relaxed">
                      Nilai rata-rata siswa pada modul tersebut berada di bawah standar kelulusan (60). 
                      Kami merekomendasikan agar siswa melakukan pengulangan materi untuk memastikan pemahaman yang lebih baik 
                      sebelum melanjutkan ke modul berikutnya.
                    </p>
                    <p className="mt-4 text-sm">
                      Hormat kami,<br />
                      <span className="font-bold">Tim Pengajar FunBox</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-green-50 border-2 border-green-600 rounded-lg">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    PERFORMA SANGAT BAIK
                  </h3>
                  <p className="text-green-800 leading-relaxed">
                    Selamat! Siswa <span className="font-bold">{report.student.name}</span> telah menyelesaikan seluruh materi dengan baik 
                    dan memenuhi standar kelulusan. Siswa dapat melanjutkan ke modul pembelajaran berikutnya.
                  </p>
                  <p className="mt-3 text-green-700 text-sm">
                    Kami merekomendasikan untuk terus mempertahankan konsistensi belajar dan semangat yang telah ditunjukkan.
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
