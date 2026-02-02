import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Layout } from "@/components/Layout";
import { useLocation } from "wouter";
import { LogOut, FileText, Users, Search, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { useState, useMemo } from "react";

export default function Admin() {
  const [_, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: students, isLoading, refetch } = useQuery({
    queryKey: [api.students.list.path],
    queryFn: async () => {
      const res = await apiFetch(api.students.list.path);
      return api.students.list.responses[200].parse(await res.json());
    }
  });

  // Local state for optimistic UI updates
  const [localStudents, setLocalStudents] = useState(students || []);

  // Update local state when server data changes
  useMemo(() => {
    if (students) {
      setLocalStudents(students);
    }
  }, [students]);

  // Handle delete student
  const handleDelete = async (studentId: number, studentName: string) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus data siswa "${studentName}"?\n\nData yang dihapus tidak dapat dikembalikan.`
    );

    if (!confirmed) {
      return;
    }

    try {
      // Optimistic UI update - remove from local state immediately
      setLocalStudents(prev => prev.filter(s => s.id !== studentId));
      
      // TODO: API Call DELETE /api/students/${studentId}
      // await apiFetch(`/api/students/${studentId}`, { method: 'DELETE' });
      
      console.log(`✅ Student ${studentId} (${studentName}) deleted successfully`);
      
      // Refetch to ensure data consistency
      // Uncomment when API is ready:
      // await refetch();
      
    } catch (error) {
      console.error('❌ Failed to delete student:', error);
      
      // Revert optimistic update on error
      if (students) {
        setLocalStudents(students);
      }
      
      alert('Gagal menghapus data siswa. Silakan coba lagi.');
    }
  };

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!localStudents) return [];
    if (!searchQuery.trim()) return localStudents;
    
    const query = searchQuery.toLowerCase();
    return localStudents.filter(student => 
      student.name.toLowerCase().includes(query) ||
      student.id.toString().includes(query)
    );
  }, [localStudents, searchQuery]);

  return (
    <Layout showNav={false} background="bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
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
        {localStudents && localStudents.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Total Siswa</p>
              <p className="text-2xl font-bold text-purple-600">{localStudents.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Siswa Terbaru</p>
              <p className="text-lg font-semibold text-gray-900">{localStudents[0]?.name}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Kelas Terbanyak</p>
              <p className="text-lg font-semibold text-gray-900">
                {localStudents.reduce((acc, s) => {
                  acc[s.className] = (acc[s.className] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)[Object.keys(localStudents.reduce((acc, s) => {
                  acc[s.className] = (acc[s.className] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)).reduce((a, b) => 
                  localStudents.reduce((acc, s) => {
                    acc[s.className] = (acc[s.className] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)[a] > localStudents.reduce((acc, s) => {
                    acc[s.className] = (acc[s.className] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)[b] ? a : b
                )]}
              </p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa atau NISN..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Student Table Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">NISN</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kelas</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guru Pendamping</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Terdaftar</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents?.map((student) => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-gray-50 transition-colors group border-b border-gray-100"
                    >
                      <td className="px-6 py-4 text-gray-500 font-mono text-sm">#{student.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                          {student.className}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {student.teacherName || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(student.createdAt || "").toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocation(`/admin/student/${student.id}/report`);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors group-hover:shadow-md"
                            title="Lihat Laporan"
                          >
                            <FileText className="w-4 h-4" />
                            Lihat
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(student.id, student.name);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors border border-red-200"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {filteredStudents?.length === 0 && !isLoading && (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">
                {searchQuery ? "Tidak ada siswa yang cocok dengan pencarian." : "Belum ada data siswa."}
              </p>
              <p className="text-sm mt-1">
                {searchQuery ? "Coba kata kunci lain." : "Siswa akan muncul di sini setelah melakukan login."}
              </p>
            </div>
          )}
        </div>

        
      </div>
    </Layout>
  );
}
