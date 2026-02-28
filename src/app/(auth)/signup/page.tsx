import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Start reviewing your resume against job descriptions
        </p>
      </div>
      <SignUpForm />
    </div>
  );
}
