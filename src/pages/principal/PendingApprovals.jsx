import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Loading, SkeletonLoader } from '../../components/common/Loading';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';
import approvalService from '../../services/approval.service';
import { formatDateTime } from '../../utils/formatters';
import { Check, X, Image as ImageIcon } from 'lucide-react';

const RejectionModal = ({ isOpen, onClose, onReject, contentId, isLoading }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason.trim().length >= 5) {
      onReject(contentId, reason);
      setReason('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Reject Content</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this content is being rejected..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
            />
            {reason.length < 5 && reason.length > 0 && (
              <p className="text-red-500 text-sm mt-1">Minimum 5 characters required</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={reason.trim().length < 5 || isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Rejecting...' : 'Reject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const PendingApprovals = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, contentId: null });
  const { data: content, loading, execute } = useApi(approvalService.getPendingApprovals);
  const { execute: approve, loading: approving } = useApi(approvalService.approveContent);
  const { execute: reject, loading: rejecting } = useApi(approvalService.rejectContent);
  const { addToast } = useToast();

  useEffect(() => {
    execute();
  }, []);

  const handleApprove = async (contentId) => {
    try {
      await approve(contentId);
      addToast('Content approved successfully!', 'success');
      execute(); // Refresh list
    } catch (error) {
      addToast('Approval failed', 'error');
    }
  };

  const handleReject = async (contentId, reason) => {
    try {
      await reject(contentId, reason);
      addToast('Content rejected!', 'success');
      setRejectionModal({ isOpen: false, contentId: null });
      execute(); // Refresh list
    } catch (error) {
      addToast('Rejection failed', 'error');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Pending Approvals</h1>

          {loading ? (
            <SkeletonLoader count={5} />
          ) : !content || content.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No pending content</p>
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
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Subject:</strong> {item.subject}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Teacher:</strong> {item.teacherName}
                    </p>

                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="text-xs text-gray-500 mb-4">
                      <p>Uploaded: {formatDateTime(item.createdAt)}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(item.id)}
                        disabled={approving}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectionModal({ isOpen: true, contentId: item.id })}
                        disabled={rejecting}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <RejectionModal
            isOpen={rejectionModal.isOpen}
            contentId={rejectionModal.contentId}
            onClose={() => setRejectionModal({ isOpen: false, contentId: null })}
            onReject={handleReject}
            isLoading={rejecting}
          />
        </main>
      </div>
    </div>
  );
};