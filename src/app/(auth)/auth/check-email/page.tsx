import Link from 'next/link';

export default function CheckEmailPage() {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-xl font-semibold">Check your email</h1>
      <p className="text-zinc-400 text-sm">
        We sent you a confirmation link. Click it to activate your account, then sign in.
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
