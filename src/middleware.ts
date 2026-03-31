import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Mengambil status login dari cookies
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value;

  // Tentukan halaman mana saja yang harus login dulu baru bisa dibuka
  // Contoh: halaman /home
  const isProtectedPage = request.nextUrl.pathname.startsWith('/home');

  if (isProtectedPage && !isLoggedIn) {
    // Jika belum login tapi maksa buka /home, pindahkan ke halaman not-authorized
    return NextResponse.redirect(new URL('/auth/not-authorized', request.url));
  }

  return NextResponse.next();
}

// Atur agar middleware hanya mengecek halaman tertentu saja
export const config = {
  matcher: ['/home/:path*'], 
};