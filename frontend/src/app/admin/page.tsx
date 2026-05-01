'use client';

import { Users, FileQuestion, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Total Students', value: '1,245', icon: <Users className="w-6 h-6 text-blue-500" />, trend: '+12% this month' },
    { title: 'Questions in Bank', value: '842', icon: <FileQuestion className="w-6 h-6 text-orange-500" />, trend: '+45 this week' },
    { title: 'Avg. Accuracy', value: '68%', icon: <TrendingUp className="w-6 h-6 text-green-500" />, trend: '+3% this month' },
    { title: 'Avg. Session', value: '14m', icon: <Clock className="w-6 h-6 text-purple-500" />, trend: '-1m this week' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">{stat.icon}</div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-2">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="text-center py-12 text-gray-500">
          Activity chart will be rendered here.
        </div>
      </div>
    </div>
  );
}
