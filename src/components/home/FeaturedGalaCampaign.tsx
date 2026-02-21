"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

const GALA_GOAL = 25_000;
const GALA_DATE = "Sunday, March 8, 2026";
const GALA_TIME = "4:00 PM – 9:00 PM";
const GALA_LOCATION = "Verdi Convention Centre, Mississauga";
const GALA_IMAGE = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80";

export function FeaturedGalaCampaign() {
  const router = useRouter();

  return (
    <section className="py-16 md:py-20 bg-background px-4">
      <div className="max-w-4xl mx-auto">
        <Card
          className="border-2 border-gold/40 overflow-hidden shadow-xl shadow-gold/10 bg-card cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-gold/60"
          onClick={() => router.push("/gala")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image side */}
            <div className="relative min-h-[220px] md:min-h-[320px] w-full">
              <Image
                src={GALA_IMAGE}
                alt="Support our gala – Ramadan Giving Fundraising Iftaar"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Content side – event details + campaign CTA */}
            <CardContent className="p-6 md:p-8 flex flex-col justify-center">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                Ramadan Giving Fundraising Iftaar
              </h2>
              <ul className="space-y-3 text-muted-foreground mb-4">
                <li className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gold shrink-0" />
                  <span>{GALA_DATE}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gold shrink-0" />
                  <span>{GALA_TIME}</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gold shrink-0" />
                  <span>{GALA_LOCATION}</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mb-4">
                Join us for an evening of community, iftar, and giving. All proceeds support our programs for families in need.
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-sm font-medium text-muted-foreground">Goal:</span>
                <span className="text-lg font-bold text-foreground">
                  ${GALA_GOAL.toLocaleString()}
                </span>
              </div>
              <Button
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/gala");
                }}
                className="w-full sm:w-auto rounded-xl bg-gold hover:bg-gold/90 text-gold-foreground font-semibold shadow-lg shadow-gold/20 transition-all duration-300 hover:scale-[1.02]"
              >
                View campaign & donate
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
}
