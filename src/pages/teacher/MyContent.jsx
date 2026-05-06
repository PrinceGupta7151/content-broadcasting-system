import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Loading, SkeletonLoader } from '../../components/common/Loading';
import { useApi } from '../../hooks/useApi';
import contentService from '../../services/content.service';
import { formatDateTime, getContentStatus } from '../../utils/formatters';
import { Clock, Image as ImageIcon } from 'lucide-react';

export const MyContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: content, loading, execute } = useApi(contentService.getTeacherContent);

  useEffect(() => {
    execute();
  }, []);

  const getStatusBadge = (status, rejectionReason) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      approved: { bg: 'bg-green-100', text: 'text-green-800' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <div title={rejectionReason}>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
          {getContentStatus(status)}
        </span>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Content</h1>

          {loading ? (
            <SkeletonLoader count={5} />
          ) : !content || content.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No content uploaded yet</p>
              <p className="text-gray-400">Start by uploading your first content</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  {/* Image */}
                  <div className="bg-gray-200 h-40 overflow-hidden">
                    {item.fileUrl ? (
                      <img
                        src={item.fileUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{item.subject}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>{formatDateTime(item.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>{formatDateTime(item.endTime)}</span>
                      </div>
                    </div>

                    {getStatusBadge(item.status, item.rejectionReason)}

                    {item.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded">
                        <p className="text-sm text-red-700">
                          <strong>Reason:</strong> {item.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};