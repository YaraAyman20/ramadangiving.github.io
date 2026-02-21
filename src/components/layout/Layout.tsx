"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <div className="min-h-screen bg-background transition-theme flex flex-col overflow-x-hidden">
      {/* Sticky Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <main className="pt-20 pb-20 md:pb-0 flex-1 overflow-x-hidden">
        <div className="animate-fade-in">{children}</div>
      </main>

      {/* Footer */}
      <div className={isHomepage ? "" : "mt-10"}>
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
