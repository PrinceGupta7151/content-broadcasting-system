import React, { useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { useApi } from '../../hooks/useApi';
import contentService from '../../services/content.service';
import { Loading } from '../../components/common/Loading';
import { Image as ImageIcon, RefreshCcw } from 'lucide-react';

export const Live = () => {
  const { teacherId } = useParams();
  const { data: content, loading, error, execute } = useApi(contentService.getLiveContent);

  const fetchContent = useCallback(() => {
    if (teacherId) {
      execute(teacherId);
    }
  }, [teacherId, execute]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    if (!teacherId) return;
    const interval = setInterval(() => {
      fetchContent();
    }, 15000);

    return () => clearInterval(interval);
  }, [teacherId, fetchContent]);

  const scheduleState = useMemo(() => {
    if (!content) return null;
    const now = new Date();
    const start = new Date(content.startTime);
    const end = new Date(content.endTime);

    if (now < start) return 'Scheduled';
    if (now > end) return 'Expired';
    return 'Active';
  }, [content]);

  const formattedStart = useMemo(
    () => content?.startTime && new Date(content.startTime).toLocaleString(),
    [content]
  );

  const formattedEnd = useMemo(
    () => content?.endTime && new Date(content.endTime).toLocaleString(),
    [content]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {!teacherId ? (
          <div className="bg-white shadow-lg rounded-2xl p-10 text-center">
            <ImageIcon size={56} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900">Invalid live broadcast link</h1>
            <p className="mt-2 text-gray-500">Please check the teacher link and try again.</p>
          </div>
        ) : loading ? (
          <Loading message="Loading live content..." />
        ) : error ? (
          <div className="bg-white shadow-lg rounded-2xl p-10 text-center">
            <RefreshCcw size={56} className="mx-auto text-red-400 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900">Unable to load live content</h1>
            <p className="mt-2 text-gray-500">{error}</p>
            <button
              type="button"
              onClick={() => execute(teacherId)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-5 py-2 text-sm font-semibold hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        ) : !content ? (
          <div className="bg-white shadow-lg rounded-2xl p-10 text-center">
            <ImageIcon size={56} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900">No content available</h1>
            <p className="mt-2 text-gray-500">There is currently no active live broadcast for this teacher.</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h1>
                <p className="text-sm text-gray-500">Subject: {content.subject}</p>
              </div>
              <span className="self-start inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {scheduleState}
              </span>
            </div>

            <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-6">
              {content.fileUrl ? (
                <img src={content.fileUrl} alt={content.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Live preview unavailable
                </div>
              )}
            </div>

            <p className="text-gray-700 mb-4">{content.description || 'No description provided.'}</p>

            <div className="grid gap-3 sm:grid-cols-3 text-sm text-gray-600">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-semibold text-gray-900">Start</p>
                <p className="mt-1">{formattedStart}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-semibold text-gray-900">End</p>
                <p className="mt-1">{formattedEnd}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-semibold text-gray-900">Status</p>
                <p className="mt-1 capitalize">{content.status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};