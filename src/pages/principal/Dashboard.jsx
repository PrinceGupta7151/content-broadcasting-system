import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Loading } from '../../components/common/Loading';
import { useApi } from '../../hooks/useApi';
import approvalService from '../../services/approval.service';
import { Eye, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export const PrincipalDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: stats, loading, execute } = useApi(approvalService.getApprovalStats);

  useEffect(() => {
    execute();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <Icon size={40} className={`${color.replace('border', 'text').replace('l-4', '')}`} />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={FileText}
                label="Total Content"
                value={stats?.total || 0}
                color="border-blue-500"
              />
              <StatCard
                icon={AlertCircle}
                label="Pending"
                value={stats?.pending || 0}
                color="border-yellow-500"
              />
              <StatCard
                icon={CheckCircle}
                label="Approved"
                value={stats?.approved || 0}
                color="border-green-500"
              />
              <StatCard
                icon={AlertCircle}
                label="Rejected"
                value={stats?.rejected || 0}
                color="border-red-500"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};