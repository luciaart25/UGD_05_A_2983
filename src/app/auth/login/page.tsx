'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthFromWrapper from '../../../components/AuthFromWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi'; // Tambah import ikon mata

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
  rememberMe?: boolean;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<ErrorObject>({});
  const [attempts, setAttempts] = useState<number>(3);
  const [currentCaptcha, setCurrentCaptcha] = useState<string>('');
  
  // State untuk kontrol visibilitas password
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const generateCaptcha = useCallback(() => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCurrentCaptcha(result);
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleResetAttempts = () => {
    setAttempts(3);
    generateCaptcha();
    toast.success('Kesempatan login berhasil direset!', { theme: 'dark' });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: ErrorObject = {};
    const emailPattern = /^[0-9]+@gmail\.com$/;
    const passwordPattern = /^[0-9]{9,}$/;

    const isValidEmail = emailPattern.test(formData.email);
    const isValidPassword = passwordPattern.test(formData.password);

    if (!formData.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (!isValidEmail) {
      newErrors.email = 'Email harus sesuai dengan NPM (cth. 2983@gmail.com)';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (!isValidPassword) {
      newErrors.password = 'Password harus sesuai dengan NPM (cth. 241712983)';
    }
    
    if (!formData.captchaInput.trim()) {
      newErrors.captcha = 'Captcha belum diisi';
    } else if (formData.captchaInput !== currentCaptcha) {
      newErrors.captcha = 'Captcha salah';
    }

    if (Object.keys(newErrors).length > 0 || !isValidEmail || !isValidPassword) {
      setErrors(newErrors);
      const currentAttempts = attempts - 1;
      setAttempts(Math.max(0, currentAttempts));
      generateCaptcha();
      setFormData(prev => ({ ...prev, captchaInput: '' }));

      toast.error(`Login Gagal! Sisa kesempatan: ${Math.max(0, currentAttempts)}`, { 
        theme: 'dark', 
        position: 'top-right' 
      });
      return;
    }

    toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });
    localStorage.setItem('isLoggedIn', 'true');
    document.cookie = "isLoggedIn=true; path=/; max-age=3600"; // Cookie aktif selama 1 jam
    router.push('/home');
  };

  return (
    <AuthFromWrapper title="Login">
      {/* CSS untuk mematikan mata bawaan browser agar tidak tumpang tindih */}
      <style jsx global>{`
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
      `}</style>

      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        <p className="text-center text-sm font-semibold text-gray-600">
          Sisa Kesempatan: <span className={attempts === 0 ? "text-red-600" : "text-blue-600"}>{attempts}</span>
        </p>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan email"
          />
          {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email}</p>}
        </div>

        {/* Password Field dengan Ikon Mata */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 pr-10 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukan password"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm italic mt-1">{errors.password}</p>}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Ingat saya
            </label>
          </div>
          <Link href="/auth/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Lupa password?
          </Link>
        </div>

        {/* Captcha Section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Captcha:</span>
            <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded select-none">
              {currentCaptcha}
            </span>
            <button type="button" onClick={generateCaptcha} className="text-blue-600 hover:text-blue-800"><FiRefreshCw size={20} /></button>
          </div>
          <input
            type="text"
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan captcha"
          />
          {errors.captcha && <p className="text-red-600 text-sm italic mt-1">{errors.captcha}</p>}
        </div>

        <button
          type="submit"
          disabled={attempts === 0}
          className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors ${
            attempts === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={handleResetAttempts}
          disabled={attempts > 0}
          className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors ${
            attempts > 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          Reset Kesempatan
        </button>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Tidak punya akun?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold">
            Daftar
          </Link>
        </p>
      </form>
    </AuthFromWrapper>
  );
};

export default LoginPage;