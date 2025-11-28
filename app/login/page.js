"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (formData.get('username') === 'admin' && formData.get('password') === '1234') {
      router.push('/admin');
    } else {
      setError('Hatalı kullanıcı adı veya şifre!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Nexus Admin Girişi</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input name="username" type="text" placeholder="Kullanıcı Adı: admin" className="w-full border p-2 rounded" />
          <input name="password" type="password" placeholder="Şifre: 1234" className="w-full border p-2 rounded" />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-bold">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}