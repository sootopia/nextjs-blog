'use client';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [latestPostSlug, setLatestPostSlug] = useState<string | null>(null);
  const [latestUpdatedPostSlug, setLatestUpdatedPostSlug] = useState<string | null>(null);
  const { user, isLoading, signOut } = useAuth();

  useEffect(() => {
    const fetchSlugs = async () => {
      const latest = await supabase
        .from('posts')
        .select('slug')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      const updated = await supabase
        .from('posts')
        .select('slug')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      setLatestPostSlug(latest.data?.slug ?? null);
      setLatestUpdatedPostSlug(updated.data?.slug ?? null);
    };

    fetchSlugs();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] border-b border-gray-200 bg-white z-[1100]">
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="text-xl text-black font-bold hover:opacity-50">
          Soohyun.dev
        </Link>

        <nav>
          <ul className="flex gap-6 items-center">
            <li>
              <Link href="/" className="text-sm text-gray-700 hover:opacity-50">
                블로그
              </Link>
            </li>

            {latestPostSlug && (
              <li>
                <Link href={`/posts/${latestPostSlug}`} className="text-sm text-gray-700 hover:opacity-50">
                  최신 작성글
                </Link>
              </li>
            )}

            {latestUpdatedPostSlug && (
              <li>
                <Link href={`/posts/${latestUpdatedPostSlug}`} className="text-sm text-gray-700 hover:opacity-50">
                  최신 수정글
                </Link>
              </li>
            )}

            {isLoading
              ? null
              : user && (
                  <li>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/write-post"
                        className="inline-flex text-sm text-gray-800 px-3 h-10 items-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:opacity-75"
                      >
                        포스트 작성
                      </Link>
                      <button
                        onClick={signOut}
                        className="inline-flex text-sm text-gray-800 px-3 h-10 items-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:opacity-75"
                      >
                        로그아웃
                      </button>
                    </div>
                  </li>
                )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
