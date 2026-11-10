import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-gray-100 px-6 py-16 text-gray-900">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm sm:px-12 sm:py-20">
        <div className="relative">
          <p className="font-mono text-sm font-medium tracking-[0.3em] text-gray-500">
            404 Not Found
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            ページが見つかりません
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
            お探しのページは移動または削除されたか、URLが間違っている可能性があります
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="M12.5 4.5 7 10l5.5 5.5M7.5 10H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            トップページへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
