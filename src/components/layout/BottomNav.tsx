"use client";

import { Home, Heart, Info, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Programs", path: "/programs", icon: Heart },
];

const rightNavItems = [
  { name: "About", path: "/about", icon: Info },
  { name: "Involve", path: "/get-involved", icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();

  const renderNavItem = (item: typeof navItems[0]) => {
    const isActive = pathname === item.path;
    return (
      <li key={item.name}>
        <Link
          href={item.path}
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl min-w-[48px] transition-all duration-200",
            isActive
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div
            className={cn(
              "p-1 rounded-lg transition-all duration-200",
              isActive && "bg-primary/10"
            )}
          >
            <item.icon
              className={cn(
                "w-5 h-5 transition-transform duration-200",
                isActive && "scale-110"
              )}
            />
          </div>
          <span className={cn(
            "text-[9px] font-medium",
            isActive && "font-semibold"
          )}>
            {item.name}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border transition-theme safe-area-bottom">
      <ul className="flex items-center justify-around h-16 px-1">
        {/* Left side items */}
        {navItems.map(renderNavItem)}

        {/* Center Floating Donate Button - Links to Programs */}
        <li className="relative -mt-6">
          <Link
            href="/programs"
            className="flex flex-col items-center justify-center"
          >
            <div className="w-14 h-14 rounded-full bg-gold shadow-lg shadow-gold/30 flex items-center justify-center transition-transform duration-200 active:scale-95 hover:bg-gold/90">
              <DollarSign className="w-7 h-7 text-gold-foreground" />
            </div>
            <span className="text-[9px] font-semibold text-gold mt-0.5">
              Donate
            </span>
          </Link>
        </li>

        {/* Right side items */}
        {rightNavItems.map(renderNavItem)}
      </ul>
    </nav>
  );
}