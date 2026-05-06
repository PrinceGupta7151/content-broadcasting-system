import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { useToast } from '../../hooks/useToast';
import { useApi } from '../../hooks/useApi';
import contentService from '../../services/content.service';
import { Loading } from '../../components/common/Loading';
import { Image as ImageIcon } from 'lucide-react';

export const AllContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { data: contents, loading, execute } = useApi(contentService.getAllContent);
  const { addToast } = useToast();

  useEffect(() => {
    execute({ status: filter, search });
  }, [filter, search]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefresh = useCallback(() => {
    execute({ status: filter, search });
  }, [filter, search, execute]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 overflow-auto">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">All Content</h1>
            <p className="text-gray-600">Review and filter all uploaded content.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.5fr_0.7fr] mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, subject, or teacher"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <Loading message="Loading content..." />
          ) : !contents || contents.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg font-medium">No content available</p>
              <p className="text-gray-400 mt-2">Try a different filter or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((content) => (
                <div key={content.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
                  <div className="aspect-video bg-gray-200 overflow-hidden flex items-center justify-center">
                    {content.fileUrl ? (
                      <img
                        src={content.fileUrl}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={48} className="text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">{content.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">Teacher: {content.teacherName}</p>
                    <p className="text-sm text-gray-600 mb-3">Subject: {content.subject}</p>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                        {content.status}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(content.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};