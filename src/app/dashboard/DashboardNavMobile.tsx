"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard/history", label: "History" },
  { href: "/dashboard/new", label: "New" },
  { href: "/dashboard/upload", label: "Upload" },
];

export function DashboardNavMobile() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md safe-area-pb"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
    >
      {nav.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-colors min-w-0 ${
              active
                ? "text-amber-400"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
