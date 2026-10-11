'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const u = username.trim();
    const p = password.trim();

    // برای تست و اطمینان
    if (u === 'admin' && p === 'admin123') {
      try {
        localStorage.setItem('isAdmin', 'true');
      } catch (err) {
        console.error(err);
      }
      alert('ورود موفقیت‌آمیز بود! در حال انتقال به پنل...');
      window.location.href = '/admin';
    } else {
      setErrorMsg(`اطلاعات وارد شده اشتباه است. (شما وارد کردید: ${u})`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4" dir="rtl">
      
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <Link href="/" className="text-amber-400 hover:text-amber-300 text-sm">
          ← بازگشت به صفحه اصلی
        </Link>
        <span className="text-xs text-slate-400">ورود مدیریت سرآشپز</span>
      </div>

      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-white mb-2">ورود </h1>


        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-950 border border-red-500 text-red-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1">نام کاربری</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="نام کاربری"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">رمز عبور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition"
          >
            ورود به پنل مدیریت
          </button>
        </form>

        {/* دکمه ورود مستقیم تستی اگر فرم گیر کرد */}
        <div className="mt-4 pt-4 border-t border-slate-700 text-center">
        </div>
      </div>
    </div>
  );
}
