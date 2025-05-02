'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

type FormData = {
  email: string;
  password: string;
};

export const metadata = {
  title: '로그인 | Soohyun.dev',
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: 'onChange' });

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      router.push('/');
    } catch (error) {
      console.error(error);
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <section className="py-40">
      <div className="container">
        <div className="max-w-[400px] mx-auto p-8 rounded-xl border border-gray-200">
          <h1 className="text-2xl text-black font-bold mb-8">로그인</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && <div className="mb-3 p-4 text-red-500 font-semibold rounded-xl bg-red-50">{error}</div>}
            <div className="mb-3">
              <input
                type="text"
                className="w-full h-13 px-4 text-gray-800 rounded-xl border border-gray-300 outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 transition"
                placeholder="이메일"
                {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
              />
              {errors.email?.type === 'required' && (
                <p className="text-red-500 font-semibold text-sm mt-2">이메일을 입력해주세요.</p>
              )}
              {errors.email?.type === 'pattern' && (
                <p className="text-red-500 font-semibold text-sm mt-2">이메일 형식이 올바르지 않습니다.</p>
              )}
            </div>

            <div className="mb-6">
              <input
                type="password"
                className="w-full h-13 px-4 text-gray-800 rounded-xl border border-gray-300 outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 transition"
                placeholder="비밀번호"
                {...register('password', { required: true })}
              />
              {errors.password?.type === 'required' && (
                <p className="text-red-500 font-semibold text-sm mt-2">비밀번호를 입력해주세요.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-13 text-white font-bold bg-blue-500 rounded-xl outline-none not-disabled:active:scale-[98%] not-disabled:active:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed!"
              disabled={!isValid}
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
