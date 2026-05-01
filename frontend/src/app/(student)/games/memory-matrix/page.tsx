import MemoryMatrixGame from '@/games/MemoryMatrix/MemoryMatrix';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function MemoryMatrixPage() {
  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold mb-4">
        <ChevronLeft className="w-5 h-5" /> Back to Dashboard
      </Link>
      
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Memory Matrix</h1>
          <p className="text-gray-500 mt-1 text-lg">History • Flip cards to match historical figures. Answer questions on mismatch!</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[600px]">
        <MemoryMatrixGame />
      </div>
    </div>
  );
}
