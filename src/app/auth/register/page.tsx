'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthFormWrapper from '../../../components/AuthFromWrapper';
import SocialAuth from '../../../components/SocialAuth';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi';

type RegisterFormData = {
  username: string;
  email: string;
  nomorTelp: string;
  password: string;
  confirmPassword: string;
  captcha: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  
  const [captchaInput, setCaptchaInput] = useState('');
  const [currentCaptcha, setCurrentCaptcha] = useState('');
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordValue = watch('password');

  useEffect(() => {
    if (!passwordValue) {
      setPasswordStrength(0);
      return;
    }
    const strength = Math.min(
      (passwordValue.length > 7 ? 25 : 0) +
      (/[A-Z]/.test(passwordValue) ? 25 : 0) +
      (/[0-9]/.test(passwordValue) ? 25 : 0) +
      (/[^A-Za-z0-9]/.test(passwordValue) ? 25 : 0),
      100
    );
    setPasswordStrength(strength);
  }, [passwordValue]);

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

  const onSubmit = (data: RegisterFormData) => {
    // Validasi Captcha Manual
    if (captchaInput !== currentCaptcha) {
      toast.error('Captcha salah', { theme: 'dark' });
      generateCaptcha();
      setCaptchaInput('');
      return;
    }
    toast.success('Register Berhasil!', { theme: 'dark', position: 'top-right' });
    router.push('/auth/login');
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <AuthFormWrapper title="Register">
      <style jsx global>{`
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
      `}</style>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
        
        {/* Username Field - Validasi Tambahan: Min 3, Max 8 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input
            {...register('username', { 
              required: 'Username wajib diisi',
              minLength: { value: 3, message: 'Username minimal 3 karakter' },
              maxLength: { value: 8, message: 'Username maksimal 8 karakter' }
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan username"
          />
          {errors.username && <p className="text-red-600 text-sm italic">{errors.username.message}</p>}
        </div>

        {/* Email Field - Validasi Tambahan: Pattern Regex */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email wajib diisi',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|co)$/,
                message: 'Format email tidak valid (harus mengandung @ dan .com/.net/.co)'
              }
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan email"
          />
          {errors.email && <p className="text-red-600 text-sm italic">{errors.email.message}</p>}
        </div>

        {/* Nomor Telepon Field - Validasi Tambahan: Min 10, Hanya Angka */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
          <input
            type="text"
            {...register('nomorTelp', { 
              required: 'Nomor telepon wajib diisi',
              minLength: { value: 10, message: 'Nomor telepon minimal 10 karakter' },
              pattern: { value: /^[0-9]+$/, message: 'Hanya diperbolehkan angka' }
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.nomorTelp ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan nomor telepon"
          />
          {errors.nomorTelp && <p className="text-red-600 text-sm italic">{errors.nomorTelp.message}</p>}
        </div>

        {/* Password Field - Validasi Tambahan: Min 8 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { 
                required: 'Password wajib diisi',
                minLength: { value: 8, message: 'Password minimal 8 karakter' }
              })}
              className={`w-full px-4 pr-10 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukkan password"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }}></div>
          </div>
          <p className="text-xs text-gray-500">Strength: {passwordStrength}%</p>
          {errors.password && <p className="text-red-600 text-sm italic">{errors.password.message}</p>}
        </div>

        {/* Konfirmasi Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', { 
                required: 'Konfirmasi wajib diisi',
                validate: (val) => val === passwordValue || 'Password tidak cocok'
              })}
              className={`w-full px-4 pr-10 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukkan ulang password"
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              className="absolute right-3 top-3 text-gray-500"
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-600 text-sm italic">{errors.confirmPassword.message}</p>}
        </div>

        {/* Captcha Section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Captcha:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded select-none">{currentCaptcha}</span>
              <button type="button" onClick={generateCaptcha} className="text-blue-600 hover:text-blue-800"><FiRefreshCw size={20} /></button>
            </div>
          </div>
          <input
            type="text"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none"
            placeholder="Masukkan captcha"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg">
          Register
        </button>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun? <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold">Login</Link>
        </p>
      </form>
    </AuthFormWrapper>
  );
};

export default RegisterPage;