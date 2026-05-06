import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import {
  BarChart3,
  Upload,
  FileText,
  CheckCircle,
  Eye,
  X,
} from 'lucide-react';

const TEACHER_ROUTES = [
  { path: '/teacher/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/teacher/upload', label: 'Upload Content', icon: Upload },
  { path: '/teacher/content', label: 'My Content', icon: FileText },
];

const PRINCIPAL_ROUTES = [
  { path: '/principal/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/principal/pending', label: 'Pending Approvals', icon: CheckCircle },
  { path: '/principal/content', label: 'All Content', icon: Eye },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const routes = user?.role === ROLES.TEACHER ? TEACHER_ROUTES : PRINCIPAL_ROUTES;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-900 text-white transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">Menu</h2>
        </div>

        <nav className="p-4 space-y-2">
          {routes.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};