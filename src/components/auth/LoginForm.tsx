'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signIn } from '@/app/actions/auth';

export function LoginForm() {
  const [state, formAction] = useActionState(signIn, { error: undefined as string | undefined });

  return (
    <>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-3 sm:py-2 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-base min-h-[44px] touch-manipulation"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-3 sm:py-2 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-base min-h-[44px] touch-manipulation"
          />
        </div>
        {state?.error && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-amber-500 px-4 py-3.5 sm:py-2.5 font-medium text-zinc-950 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-950 text-base min-h-[44px] touch-manipulation"
        >
          Sign in
        </button>
      </form>
      <p className="text-center text-sm text-zinc-400 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-amber-500 hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}
