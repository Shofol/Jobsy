import Link from 'next/link';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="text-center space-y-4">
      <h1 className="text-xl font-semibold text-red-400">Authentication error</h1>
      <p className="text-zinc-400 text-sm">
        {params.message ?? 'Something went wrong. Please try again.'}
      </p>
      <Link
        href="/login"
        className="inline-block text-amber-500 hover:underline text-sm"
      >
        Back to sign in
      </Link>
    </div>
  );
}
