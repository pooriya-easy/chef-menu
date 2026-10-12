'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState(1); // مرحله 1: شماره موبایل، مرحله 2: کد تایید
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();

    // تبدیل ارقام فارسی/عربی به انگلیسی و حذف فاصله‌ها
    const normalizedPhone = phoneNumber
      .trim()
      .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
      .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));

    // بررسی قالب شماره موبایل ایران
    if (!/^09\d{9}$/.test(normalizedPhone)) {
      setErrorMsg('لطفاً یک شماره موبایل ۱۱ رقمی معتبر وارد کنید.');
      return;
    }

    setErrorMsg('');
    setPhoneNumber(normalizedPhone);
    setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otpCode.trim();

    // فقط شماره ادمین با کد ۱۲۳۴۵۶ اجازه ورود به پنل ادمین را دارد
    if (phoneNumber === '09931086546' && cleanOtp === '123456') {
      try {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('isLoggedIn', 'true');
      } catch (err) {
        console.error(err);
      }
      alert('ورود موفقیت‌آمیز بود! در حال انتقال به پنل...');
      window.location.href = '/admin';
    } else {
      setErrorMsg('کد تایید یا شماره وارد شده برای ورود نامعتبر است.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center items-center p-4" dir="rtl">
      
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <Link href="/" className="text-amber-500 hover:text-amber-400 text-sm transition-colors">
          ← بازگشت به صفحه اصلی
        </Link>
        <span className="text-xs text-zinc-500">ورود مدیریت سرآشپز</span>
      </div>

      <div className="w-full max-w-md bg-[#111111] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          {step === 1 ? 'ورود' : 'تایید شماره'}
        </h1>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-900 text-red-400 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {step === 1 ? (
          /* مرحله اول: دریافت شماره موبایل */
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-xs text-zinc-400 mb-2 mr-1">شماره تلفن</label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0912654321"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-all text-left"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition-transform active:scale-95"
            >
              دریافت کد یک‌بار مصرف
            </button>
          </form>
        ) : (
          /* مرحله دوم: وارد کردن کد تایید */
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-xs text-zinc-400 mb-2 mr-1">
                کد تایید ۶ رقمی به شماره {phoneNumber} ارسال شد
              </label>
              <input
                type="text"
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="- - - - - -"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white text-center text-lg tracking-[0.6em] focus:outline-none focus:border-amber-500 transition-all"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition-transform active:scale-95"
            >
              تایید و ورود
            </button>

            <button 
              type="button" 
              onClick={() => {
                setStep(1);
                setErrorMsg('');
              }}
              className="w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              ویرایش شماره موبایل
            </button>
          </form>
        )}

        <div className="mt-8 pt-4 border-t border-zinc-800/50 text-center">
          <p className="text-[10px] text-zinc-600">
            با ورود به سرآشپز، قوانین و مقررات را می‌پذیرم.
          </p>
        </div>
      </div>
    </div>
  );
}
