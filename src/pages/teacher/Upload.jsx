import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { useToast } from '../../hooks/useToast';
import { useApi } from '../../hooks/useApi';
import contentService from '../../services/content.service';
import { uploadContentSchema } from '../../utils/validators';
import { SUBJECTS } from '../../utils/constants';
import { Upload as UploadIcon, Image, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Upload = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { execute: uploadContent, loading } = useApi(contentService.uploadContent);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(uploadContentSchema),
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('subject', data.subject);
      formData.append('description', data.description || '');
      formData.append('file', data.file);
      formData.append('startTime', data.startTime);
      formData.append('endTime', data.endTime);
      formData.append('rotationDuration', data.rotationDuration || 0);

      await uploadContent(formData);
      addToast('Content uploaded successfully!', 'success');
      reset();
      setPreview(null);
      navigate('/teacher/content');
    } catch (error) {
      addToast('Upload failed', 'error');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Upload Content</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-8">
              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter content title"
                  {...register('title')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Subject */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  {...register('subject')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                >
                  <option value="">Select a subject</option>
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter content description"
                  rows="4"
                  {...register('description')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                />
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File (JPG, PNG, GIF - Max 10MB) *
                </label>
                <div className="relative">
                  <Controller
                    name="file"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif"
                          ref={field.ref}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                            handleFileChange(e);
                          }}
                          className="hidden"
                          id="file-input"
                        />
                        <label
                          htmlFor="file-input"
                          className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
                        >
                          <UploadIcon className="mx-auto text-gray-400 mb-2" size={32} />
                          <p className="text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-gray-400 text-sm">JPG, PNG, GIF up to 10MB</p>
                        </label>
                      </>
                    )}
                  />
                </div>
                {errors.file && (
                  <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
                )}

                {/* Preview */}
                {preview && (
                  <div className="mt-4 relative inline-block">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 max-w-full rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setPreview(null)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Start Time */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  {...register('startTime')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                )}
              </div>

              {/* End Time */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  {...register('endTime')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
                )}
              </div>

              {/* Rotation Duration */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotation Duration (seconds)
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('rotationDuration', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload Content'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};