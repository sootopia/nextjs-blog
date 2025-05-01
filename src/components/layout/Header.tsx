import Link from 'next/link';

export default function Header() {
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

            <li>
              <Link href="/" className="text-sm text-gray-700 hover:opacity-50">
                최신 작성글
              </Link>
            </li>

            <li>
              <Link href="/" className="text-sm text-gray-700 hover:opacity-50">
                최신 수정글
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
