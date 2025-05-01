'use client';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

type Post = {
  id: string;
  title: string;
  content: string;
  summary: string;
  category_id: string;
  created_at: string;
  slug: string;
  author_id: string;
  views: number;
  likes: number;
  categories: {
    name: string;
  };
};

export default function Home() {
  const [fetchedPosts, setFetchedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(
            `
          *,
          categories (
            name
          )
        `,
          )
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setFetchedPosts(data || []);
      } catch (error) {
        setError('게시물을 불러오는 데 실패했습니다.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    return `${year}. ${String(month).padStart(2, '0')}. ${String(day).padStart(2, '0')}`;
  };

  return (
    <>
      <section className="py-40">
        <div className="container">
          <h2 className="text-xl text-black font-bold mb-10">최신 작성 글</h2>
          <div className="grid grid-cols-4 gap-6">
            {error ? (
              <div className="col-span-4 text-center text-red-500 rounded-xl p-6 bg-red-50">{error}</div>
            ) : isLoading ? (
              <>
                {[...Array(8)].map((_, index) => (
                  <div
                    className="flex flex-col justify-between border border-gray-200 rounded-xl overflow-hidden"
                    key={index}
                  >
                    <div>
                      <figure className="relative aspect-video bg-gray-100 animate-pulse"></figure>
                      <div className="p-4">
                        <div className="h-6 mb-2 bg-gray-100 rounded animate-pulse"></div>
                        <div className="h-5 bg-gray-100 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <div className="h-5 bg-gray-100 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              fetchedPosts.map((post) => (
                <Link
                  href={`/posts/${post.slug}`}
                  className="flex flex-col justify-between border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl shadow-gray-100"
                  key={post.id}
                >
                  <div>
                    <figure className="relative aspect-video overflow-hidden">
                      <Image
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        src="https://dummyimage.com/480x270"
                        alt=""
                        width={400}
                        height={300}
                      />
                    </figure>
                    <div className="p-4">
                      <h3 className="text-gray-900 font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm">{post.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 p-4 border-t border-gray-200">
                    <span className="text-[11px] font-semibold text-green-600 py-1 px-2 rounded-lg bg-green-50">
                      {post.categories?.name}
                    </span>
                    <span className="text-gray-500 text-xs">{formatDate(post.created_at)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
