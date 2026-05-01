import KnowledgeRunnerGame from '@/games/KnowledgeRunner/KnowledgeRunner';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function KnowledgeRunnerPage() {
  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold mb-4">
        <ChevronLeft className="w-5 h-5" /> Back to Dashboard
      </Link>
      
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Knowledge Runner</h1>
          <p className="text-gray-500 mt-1 text-lg">English • Run and jump, answer when you crash!</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
        <KnowledgeRunnerGame />
      </div>
    </div>
  );
}
