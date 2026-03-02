export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-zinc-950 text-zinc-100 p-4 py-8">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
