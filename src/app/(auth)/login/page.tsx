import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Access your Jobsy analyses
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
