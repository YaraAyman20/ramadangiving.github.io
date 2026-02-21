"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface HeroSectionProps {
  onDonateClick: () => void;
}

export function HeroSection({ onDonateClick }: HeroSectionProps) {
  return (
    <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-card">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Left */}
          <div className="space-y-6 order-2 md:order-1">
            <h1 className="text-[36px] md:text-[48px] font-bold text-foreground leading-tight">
              Carrying the spirit of Ramadan all year.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              For the community, by the community. Humans for Humans.
            </p>
            <div className="flex pt-2">
              <Button
                size="lg"
                onClick={onDonateClick}
                className="h-14 px-8 text-lg font-semibold rounded-2xl bg-gold hover:bg-gold/90 text-gold-foreground shadow-xl shadow-gold/30 transition-all duration-300 hover:scale-105"
              >
                <Heart className="w-5 h-5 mr-2" />
                Donate Now
              </Button>
            </div>
          </div>

          {/* Image Right */}
          <div className="order-1 md:order-2">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80"
                alt="Community impact"
                className="w-full h-[300px] md:h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}