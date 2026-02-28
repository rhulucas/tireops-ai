"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname?.startsWith("/login");

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <main className="pl-56">{children}</main>
    </>
  );
}
