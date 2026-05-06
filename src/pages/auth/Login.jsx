import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { loginSchema } from '../../utils/validators';
import { ROLES } from '../../utils/constants';
import { LogIn } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      const redirectPath =
        user.role === ROLES.TEACHER ? '/teacher/dashboard' : '/principal/dashboard';
      navigate(redirectPath);
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      const response = await login(data.email, data.password);
      addToast('Login successful!', 'success');

      const redirectPath =
        response.user.role === ROLES.TEACHER
          ? '/teacher/dashboard'
          : '/principal/dashboard';
      navigate(redirectPath);
    } catch (error) {
      addToast(error.message || 'Login failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-center mb-8">
          <div className="bg-blue-600 p-4 rounded-full">
            <LogIn className="text-white" size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Login</h1>
        <p className="text-center text-gray-600 mb-8">
          Content Broadcasting System
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
          <p className="text-sm text-gray-800">
            <strong>Teacher:</strong> teacher@test.com / 123456
          </p>
          <p className="text-sm text-gray-800">
            <strong>Principal:</strong> principal@test.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
};