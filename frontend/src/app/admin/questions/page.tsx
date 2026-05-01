'use client';

import { useState } from 'react';
import { Database, Search, Plus, Edit2, Trash2, Filter } from 'lucide-react';

const MOCK_QUESTIONS = [
  { id: 1, subject: 'Mathematics', grade: 2, type: 'mcq', prompt: 'What is 5 + 7?', correctAnswer: '12' },
  { id: 2, subject: 'Science', grade: 3, type: 'mcq', prompt: 'Which planet is known as the Red Planet?', correctAnswer: 'Mars' },
  { id: 3, subject: 'English', grade: 1, type: 'fill-blank', prompt: 'The opposite of Hot is ___', correctAnswer: 'Cold' },
  { id: 4, subject: 'History', grade: 4, type: 'mcq', prompt: 'Who was the first US President?', correctAnswer: 'George Washington' },
];

export default function QuestionBankPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');

  const filteredQuestions = MOCK_QUESTIONS.filter(q => {
    const matchesSearch = q.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'All' || q.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Question Bank</h1>
            <p className="text-gray-500">Manage game questions across all subjects</p>
          </div>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Question
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search questions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-900 bg-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-5 h-5 text-gray-400" />
            <select 
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-900 bg-transparent"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="All">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-semibold w-1/2">Prompt</th>
                <th className="p-4 font-semibold">Subject / Grade</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">{q.prompt}</div>
                    <div className="text-sm text-gray-500 mt-1">Ans: <span className="font-medium text-emerald-600">{q.correctAnswer}</span></div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200 text-xs font-bold">
                        {q.subject}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">Grade {q.grade}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold uppercase border border-purple-200">
                      {q.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredQuestions.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No questions found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
