"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Mail,
  Receipt,
  PencilRuler,
  FlaskConical,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quoting", label: "AI Quoting", icon: FileText },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/email", label: "Email AI", icon: Mail },
  { href: "/invoice", label: "Invoice AI", icon: Receipt },
  { href: "/tread-designer", label: "Tread Designer", icon: PencilRuler },
  { href: "/compound-spec", label: "Compound Spec", icon: FlaskConical },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-amber-900/30 bg-zinc-950">
      <div className="flex h-16 items-center gap-2 border-b border-amber-900/30 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
          <span className="text-lg font-bold">T</span>
        </div>
        <span className="font-semibold text-zinc-100">TireOps AI</span>
      </div>
      <nav className="space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-amber-500/20 text-amber-400"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 border-t border-amber-900/30 p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </button>
      </div>
    </aside>
  );
}
