"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard/history", label: "History" },
  { href: "/dashboard/new", label: "New analysis" },
  { href: "/dashboard/upload", label: "Upload CV" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="p-3 flex flex-col gap-1">
      {nav.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-amber-500/20 text-amber-400"
                : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
