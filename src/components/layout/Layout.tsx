"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { SmartDonationModal } from "@/components/home/SmartDonationModal";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <div className="min-h-screen bg-background transition-theme flex flex-col overflow-x-hidden">
      {/* Sticky Top Navigation */}
      <TopNav onDonateClick={() => setDonationModalOpen(true)} />

      {/* Main Content */}
      <main className="pt-20 pb-20 md:pb-0 flex-1 overflow-x-hidden">
        <div className="animate-fade-in">{children}</div>
      </main>

      {/* Footer */}
      <div className={isHomepage ? "" : "mt-10"}>
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onDonateClick={() => setDonationModalOpen(true)} />

      {/* Smart Donation Modal */}
      <SmartDonationModal 
        open={donationModalOpen} 
        onOpenChange={setDonationModalOpen} 
      />
    </div>
  );
}
