import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center px-4">
      <h1 className="text-6xl font-extrabold text-slate-800 dark:text-slate-200">404</h1>
      <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-400">Page not found</h2>
      <p className="text-slate-500 max-w-md">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
      <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
        Return Home
      </Link>
    </div>
  );
}
