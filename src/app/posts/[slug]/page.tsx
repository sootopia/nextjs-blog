import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import readingTime from 'reading-time';
import 'highlight.js/styles/github-dark.css';

type Post = {
  id: string;
  title: string;
  content: string;
  category_id: string;
  author_id: string;
  views: number;
  created_at: string;
  updated_at: string;
  slug: string;
  categories: {
    name: string;
  };
};

export default async function Post({ params }: { params: { slug: string } }) {
  const { data: post, error } = await supabase
    .from('posts')
    .select(`*, categories(name)`)
    .eq('slug', params.slug)
    .single();

  if (error || !post) {
    notFound();
  }

  const readingMinutes = parseInt(Number(readingTime(post.content).minutes).toFixed(0));

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}. ${month}. ${day}`;
  };

  return (
    <section className="py-40">
      <div className="container">
        <div className="max-w-[800px] mx-auto">
          <div className="mb-8 pb-3 border-b border-gray-200">
            <h1 className="text-4xl text-black font-semibold mb-3">{post?.title}</h1>
            <div className="flex items-center">
              <span className="text-green-600 text-sm font-semibold py-1 px-2 rounded-lg bg-green-100">
                {post?.categories?.name}
              </span>
              <span className="text-gray-400 mx-1">・</span>
              <span className="text-gray-500 text-sm">{formatDate(post?.created_at)}</span>
              <span className="text-gray-400 mx-1">・</span>
              <span className="text-gray-500 text-sm inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                </svg>
                {readingMinutes}분
              </span>
            </div>
          </div>
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {post?.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  );
}
