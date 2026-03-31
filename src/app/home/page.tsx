'use client'
import React, { useEffect } from "react"; // Tambahkan useEffect
import { useRouter } from "next/navigation"; // Tambahkan useRouter
import Game1 from "../../components/Game1";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Cek apakah ada tanda login
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      // Jika tidak ada, arahkan ke halaman not-authorized sesuai soal
      router.push('/auth/not-authorized');
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen">
      <h1 className="text-4xl font-bold mb-4 text-white">Selamat Datang!</h1>
      <Game1 />
    </div>
  );
}