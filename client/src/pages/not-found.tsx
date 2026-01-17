import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <Layout showNav={false}>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500">
            <AlertCircle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground">Halaman Hilang!</h1>
          <p className="text-lg text-muted-foreground">
            Sepertinya kamu tersesat di luar angkasa. Ayo kembali ke markas!
          </p>
          <Link href="/">
            <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 btn-push hover:brightness-110">
              Kembali ke Beranda
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
