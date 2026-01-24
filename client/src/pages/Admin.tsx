import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Layout } from "@/components/Layout";
import { useLocation } from "wouter";
import { LogOut, FileText, Users } from "lucide-react";

export default function Admin() {
  const [_, setLocation] = useLocation();

  const { data: students, isLoading } = useQuery({
    queryKey: [api.students.list.path],
    queryFn: async () => {
      const res = await fetch(api.students.list.path);
      return api.students.list.responses[200].parse(await res.json());
    }
  });

  return (
    <Layout showNav={false} background="bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500">Monitor dan kelola kemajuan siswa</p>
            </div>
          </div>
          <button 
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>

        {/* Quick Stats */}
        {students && students.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Total Siswa</p>
              <p className="text-2xl font-bold text-purple-600">{students.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Siswa Terbaru</p>
              <p className="text-lg font-semibold text-gray-900">{students[0]?.name}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Kelas Terbanyak</p>
              <p className="text-lg font-semibold text-gray-900">
                {students.reduce((acc, s) => {
                  acc[s.className] = (acc[s.className] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)[Object.keys(students.reduce((acc, s) => {
                  acc[s.className] = (acc[s.className] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)).reduce((a, b) => 
                  students.reduce((acc, s) => {
                    acc[s.className] = (acc[s.className] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)[a] > students.reduce((acc, s) => {
                    acc[s.className] = (acc[s.className] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)[b] ? a : b
                )]}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Daftar Siswa</h2>
            <p className="text-sm text-gray-600">Klik pada baris untuk melihat laporan detail</p>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
              <p className="text-gray-500">Memuat data siswa...</p>
            </div>
          ) : (
            
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kelas</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Terdaftar</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students?.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-purple-50/50 transition-colors cursor-pointer group"
                    onClick={() => setLocation(`/admin/student/${student.id}/report`)}
                  >
                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">#{student.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        {student.className}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(student.createdAt || "").toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/admin/student/${student.id}/report`);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors group-hover:shadow-md"
                      >
                        <FileText className="w-4 h-4" />
                        Lihat Laporan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {students?.length === 0 && !isLoading && (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Belum ada data siswa.</p>
              <p className="text-sm mt-1">Siswa akan muncul di sini setelah melakukan login.</p>
            </div>
          )}
        </div>

        
      </div>
    </Layout>
  );
}
