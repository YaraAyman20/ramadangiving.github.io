"use client";

import { useState } from "react";
import { Heart, Users, Quote, Building2, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { EventsCalendarDashboard } from "@/components/home/EventsCalendarDashboard";
import { PurposeMission } from "@/components/home/PurposeMission";
import { ImpactCharts } from "@/components/home/ImpactCharts";
import { GalleryOfEvents } from "@/components/home/GalleryOfEvents";
import { SmartDonationModal } from "@/components/home/SmartDonationModal";

const testimonials = [
  {
    quote:
      "Ramadan Giving helped our family during the most difficult time. Their support was a blessing.",
    author: "Sarah M.",
    location: "Toronto, CA",
  },
  {
    quote:
      "The transparency and care this organization shows is unmatched. Every dollar makes a real impact.",
    author: "Omar K.",
    location: "Toronto, CA",
  },
  {
    quote:
      "I've been volunteering for 3 years. The dedication of this team inspires me every day.",
    author: "Fatima A.",
    location: "Toronto, CA",
  },
];

export default function Home() {
  const router = useRouter();
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  return (
    <div className="space-y-0 overflow-x-hidden">
      {/* 1. Hero Section - Split View */}
      <HeroSection onDonateClick={() => setDonationModalOpen(true)} />

      {/* 2. Community Calendar - Base bg */}
      <section className="py-16 md:py-20 bg-card px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[32px] md:text-[40px] font-bold text-foreground text-center mb-10">
            Community Calendar
          </h2>
          <EventsCalendarDashboard />
        </div>
      </section>

      {/* 3. Our Purpose & Mission - Surface bg */}
      <PurposeMission />

      {/* 4. Our Impact - Charts - Base bg */}
      <ImpactCharts />

      {/* 5. Our Fundraisers - Surface bg */}
      <section className="py-16 md:py-20 bg-background px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[32px] md:text-[40px] font-bold text-foreground text-center mb-2">
            Our Fundraisers
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Making a difference through targeted initiatives
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-32 bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                <Heart className="w-12 h-12 text-primary" />
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  Hunger Relief
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Providing meals and groceries to families in need throughout
                  the year.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-32 bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center">
                <Users className="w-12 h-12 text-gold" />
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  Community Support
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Winter relief kits, clothing drives, and essential supplies for
                  vulnerable families.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-32 bg-gradient-to-br from-primary/30 to-gold/10 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-primary" />
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  Emergency Aid
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Rapid response to crises and ongoing support for affected
                  communities worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => router.push("/programs")}
              className="rounded-xl px-8"
            >
              View All Fundraisers
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Gallery of Events - Base bg */}
      <GalleryOfEvents />

      {/* 7. Community Voices - 2-Column Grid - Surface bg */}
      <section className="py-16 md:py-20 bg-background px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[32px] md:text-[40px] font-bold text-foreground text-center mb-2">
            Community Voices
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Hear from the people we serve
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Left: Testimonial */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm flex flex-col">
              <CardContent className="p-8 md:p-10 flex flex-col items-center justify-center text-center space-y-6 flex-1">
                <div className="mx-auto w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                  <Quote className="w-8 h-8 text-gold" />
                </div>
                <blockquote className="text-foreground italic text-xl md:text-2xl leading-relaxed max-w-lg">
                  &ldquo;{testimonials[testimonialIndex].quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-bold text-foreground text-lg">
                    {testimonials[testimonialIndex].author}
                  </p>
                  <p className="text-muted-foreground">
                    {testimonials[testimonialIndex].location}
                  </p>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTestimonialIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === testimonialIndex
                          ? "w-8 bg-gold"
                          : "bg-muted-foreground/30"
                        }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Right: Instagram Embed */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm flex flex-col">
              <CardContent className="p-8 md:p-10 flex flex-col items-center justify-center text-center space-y-4 flex-1">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Follow Our Journey
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  See our latest community moments, event highlights, and
                  behind-the-scenes stories on Instagram.
                </p>
                <Button
                  variant="outline"
                  className="rounded-xl mt-4"
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/ramadan.giving",
                      "_blank"
                    )
                  }
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  @ramadan.giving
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 8. Pre-Footer - Solid Teal */}
      <section className="py-16 bg-[#0a4b59] w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-[32px] md:text-[40px] font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto text-lg">
            Join thousands of donors and volunteers who are transforming lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setDonationModalOpen(true)}
              className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold rounded-xl h-12 px-8 shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Heart className="w-4 h-4 mr-2" />
              Donate Now
            </Button>
            <Button
              size="lg"
              onClick={() => router.push("/get-involved")}
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold rounded-xl h-12 px-8 transition-all duration-300"
            >
              <Users className="w-4 h-4 mr-2" />
              Get Involved
            </Button>
          </div>
        </div>
      </section>

      <SmartDonationModal
        open={donationModalOpen}
        onOpenChange={setDonationModalOpen}
      />
    </div>
  );
}
