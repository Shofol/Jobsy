import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import Link from "next/link";
import { DashboardNav } from "./DashboardNav";
import { DashboardNavMobile } from "./DashboardNavMobile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/50">
        <div className="p-4 border-b border-zinc-800">
          <Link href="/dashboard" className="font-semibold text-amber-500">
            Jobsy
          </Link>
        </div>
        <DashboardNav />
      </aside>

      {/* Main area: toolbar + content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-14 shrink-0 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-4 sm:px-6 gap-2">
          <span className="text-sm text-zinc-500 hidden sm:inline">Dashboard</span>
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 justify-end">
            <span className="text-sm text-zinc-400 truncate max-w-[140px] sm:max-w-[200px]" title={user.email ?? undefined}>
              {user.email}
            </span>
            <form action={signOut} className="shrink-0">
              <button
                type="submit"
                className="text-sm text-zinc-400 hover:text-zinc-200 py-2 px-1 -m-1 touch-manipulation"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 overflow-auto pb-24 md:pb-0">
          <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <DashboardNavMobile />
    </div>
  );
}
