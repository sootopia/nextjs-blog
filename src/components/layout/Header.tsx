'use client';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

type Post = {
  slug: string;
};

export default function Header() {
  const [latestPostSlug, setLatestPostSlug] = useState<Post | null>(null);
  const [latestUpdatedPostSlug, setLatestUpdatedPostSlug] = useState<Post | null>(null);

  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('slug')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          throw error;
        }

        setLatestPostSlug(data[0].slug || null);
      } catch (error) {
        console.error('최신 작성글 불러오기 실패 : ', error);
      }
    };

    fetchLatestPost();
  }, []);

  useEffect(() => {
    const fetchLatestUpdatedPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('slug')
          .order('updated_at', { ascending: false })
          .limit(1);

        if (error) {
          throw error;
        }

        setLatestUpdatedPostSlug(data[0].slug || null);
      } catch (error) {
        console.error('최신 수정글 불러오기 실패 : ', error);
      }
    };

    fetchLatestUpdatedPost();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] border-b border-gray-200">
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="text-xl text-black font-bold hover:opacity-50">
          Soohyun.dev
        </Link>

        <nav>
          <ul className="flex gap-6">
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
          </ul>
        </nav>
      </div>
    </header>
  );
}
