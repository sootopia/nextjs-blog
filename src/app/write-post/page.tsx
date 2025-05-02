'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

type Category = {
  id: string;
  name: string;
};

type FormData = {
  title: string;
  slug: string;
  category_id: string;
  content: string;
  summary: string;
};

export default function WritePost() {
  const { user, isLoading } = useAuth();
  const [submitLoading, setSubmitLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: 'onChange' });

  const [categories, setCategories] = useState<Category[]>([]);

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setSubmitLoading(true);

    try {
      // 슬러그 중복 체크
      const { data: existingPost, error: checkError } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', data.slug)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // 에러 코드 PGRST116은 결과 값이 없을 때의 코드
        alert('슬러그 중복체크 중 오류가 발생했습니다.');
        return;
      }

      if (existingPost) {
        alert('이미 존재하는 슬러그입니다. 다른 슬러그를 입력해 주세요.');
        return;
      }

      const { error } = await supabase.from('posts').insert({
        title: data.title,
        slug: data.slug,
        category_id: data.category_id,
        author_id: user.id,
        content: data.content,
        summary: data.summary,
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      router.push('/');
    } catch (error) {
      console.error('포스트 작성 실패: ', error);
      alert('게시글 작성에 실패하였습니다.');
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  // 카테고리 목록 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('id, name');

        if (error) {
          console.error('카테고리 로드 실패 : ', error);
          return;
        }

        setCategories(data || []);
      } catch (error) {
        console.error('카테고리 로드 실패: ', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-40">
      <div className="container">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-2xl text-black font-bold mb-8">포스트 작성하기</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                type="text"
                className="w-full h-13 px-4 text-gray-800 rounded-xl border border-gray-300 outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 transition"
                placeholder="제목"
                {...register('title', { required: true })}
              />
              {errors.title?.type === 'required' && (
                <p className="text-red-500 font-semibold text-sm mt-2">제목을 입력해주세요.</p>
              )}
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="w-full h-13 px-4 text-gray-800 rounded-xl border border-gray-300 outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 transition"
                placeholder="슬러그"
                {...register('slug', { required: true })}
              />
              {errors.slug?.type === 'required' && (
                <p className="text-red-500 font-semibold text-sm mt-2">슬러그를 입력해주세요.</p>
              )}
            </div>

            <div className="mb-3">
              <select
                className="relative w-full h-13 px-4 text-gray-800 rounded-xl border border-gray-300 outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 transition appearance-none bg-[url('/images/select_arrow.svg')] bg-no-repeat bg-[right_16px_center] cursor-pointer"
                {...register('category_id', { required: true })}
              >
                <option value="">카테고리 선택</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id?.type === 'required' && (
                <p className="text-red-500 font-semibold text-sm mt-2">카테고리를 선택해주세요.</p>
              )}
            </div>

            <div className="mb-3">
              <textarea
                className="w-full h-26 p-4 text-gray-800 rounded-xl border border-gray-300 outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 transition resize-none"
                placeholder="요약내용"
                {...register('summary', { required: true })}
              />
              {errors.slug?.type === 'required' && (
                <p className="text-red-500 font-semibold text-sm mt-2">요약내용을 입력해주세요.</p>
              )}
            </div>

            <div className="mb-6">
              <Controller
                name="content"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <MDEditor value={value || ''} onChange={(value) => onChange(value || '')} height={400} />
                )}
              />
              {errors?.content?.type === 'required' && (
                <p className="text-red-500 font-semibold text-sm mt-2">내용을 입력해주세요.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-13 text-white font-bold bg-blue-500 rounded-xl outline-none not-disabled:active:scale-[98%] not-disabled:active:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed!"
              disabled={!isValid || submitLoading}
            >
              {submitLoading ? '작성중...' : '작성완료'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
