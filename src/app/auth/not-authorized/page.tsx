'use client';

import Link from 'next/link';
import Image from 'next/image';
import AuthFromWrapper from '../../../components/AuthFromWrapper';

const NotAuthorizedPage = () => {
  return (
      <div className="flex flex-col items-center text-center p-6 border border-white/30 rounded-3xl bg-white/20 backdrop-blur-blur space-y-1">
        
        {/* 1. Gambar di paling atas */}
        <div className="relative w-100 h-64">
          <Image 
            src="/porto3.jpeg" 
            alt="Not Authorized"
            fill
            className="object-contain"
          />
        </div>

        {/* 2. Tulisan "Anda belum login" */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-800">
            ❌ Anda belum login
          </h2>
          
          {/* 3. Tulisan dengan ukuran font lebih kecil */}
          <p className="text-sm text-gray-500">
            silakan login terlebih dahulu
          </p>
        </div>
        
        {/* 4. Tombol Kembali */}
        <Link 
          href="/auth/login" 
          className="w-30 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
        >
          ← Kembali
        </Link>
      </div>
  );
};

export default NotAuthorizedPage;