'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Users, FileQuestion, BarChart3, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-8">
            <Settings className="w-6 h-6 text-blue-400" />
            Admin Panel
          </h2>
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-white rounded-lg font-medium transition-colors">
              <BarChart3 className="w-5 h-5 text-blue-400" /> Dashboard
            </Link>
            <Link href="/admin/students" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
              <Users className="w-5 h-5 text-green-400" /> Students
            </Link>
            <Link href="/admin/questions" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
              <FileQuestion className="w-5 h-5 text-orange-400" /> Question Bank
            </Link>
          </nav>
        </div>
        <div className="p-6 border-t border-slate-800">
          <p className="text-sm mb-4">Logged in as <span className="text-white font-bold">{user.name}</span></p>
          <button 
            onClick={() => { logout(); router.push('/login'); }}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
