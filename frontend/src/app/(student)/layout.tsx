'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Home, Gamepad2, Award, PlayCircle } from 'lucide-react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isHydrated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && (!user || user.role !== 'student')) {
      router.push('/login');
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user) return null;

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white shadow-xl flex flex-col justify-between">
        <div className="p-6">
          <h2 className="text-2xl font-extrabold text-blue-600 tracking-tight flex items-center gap-2">
            <Gamepad2 className="w-8 h-8" />
            LearnPlay
          </h2>
          <nav className="mt-8 space-y-4">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold transition-colors">
              <Home className="w-5 h-5" /> Dashboard
            </Link>
            <Link href="/games" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
              <Gamepad2 className="w-5 h-5" /> Games
            </Link>
            <Link href="/lectures" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
              <PlayCircle className="w-5 h-5" /> Lectures
            </Link>
            <Link href="/rewards" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
              <Award className="w-5 h-5" /> My Rewards
            </Link>
          </nav>
        </div>
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">Grade {user.grade}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); router.push('/login'); }}
            className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" /> Log Out
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
