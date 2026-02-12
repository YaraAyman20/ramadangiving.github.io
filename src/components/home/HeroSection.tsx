import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const heroImages = [
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&q=80",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80",
];

interface HeroSectionProps {
  onDonateClick: () => void;
}

export function HeroSection({ onDonateClick }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-screen h-[400px] md:h-[500px] overflow-hidden left-1/2 right-1/2 -mx-[50vw]">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <img src={image} alt={`Community impact ${index + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 md:px-12">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg pt-6">
            Ramadan: Carrying the spirit of Ramadan all year.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            A project of Bridging Borders. Serving humanity through hunger relief, education, and emergency aid since 2021.
          </p>
          <div className="flex justify-center pt-4">
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-8">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentImageIndex ? "w-8 bg-gold" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}