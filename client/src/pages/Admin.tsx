import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Layout } from "@/components/Layout";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";

export default function Admin() {
  const [_, setLocation] = useLocation();

  const { data: students } = useQuery({
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Monitor kemajuan siswa</p>
          </div>
          <button 
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students?.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-gray-500 font-mono text-sm">#{student.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                      {student.className}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(student.createdAt || "").toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students?.length === 0 && (
            <div className="p-8 text-center text-gray-500">Belum ada data siswa.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
