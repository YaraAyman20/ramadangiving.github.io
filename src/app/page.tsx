"use client";

import { useState } from "react";
import { Heart, Users, Quote, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/home/HeroSection";
import { BentoGrid } from "@/components/home/BentoGrid";
import { ImpactTimeline } from "@/components/home/ImpactTimeline";
import { CurrentEvents, type CurrentEvent } from "@/components/home/CurrentEvents";
import { CommunityCarousel } from "@/components/home/CommunityCarousel";
import { SmartDonationModal } from "@/components/home/SmartDonationModal";

const currentEvents: CurrentEvent[] = [
  {
    id: "gala-iftar-2026",
    title: "Ramadan Giving Fundraising Iftaar",
    label: "Gala",
    summary:
      "Join us for a night of giving back. Come together for speakers, nasheed artists, delicious food, and community—all for a great cause. Early bird tickets $60 (until Feb 15), regular $70; 100% of ticket revenue funds our initiatives for underserved populations.",
    url: "https://www.eventbrite.com/e/ramadan-giving-fundraising-iftaar-tickets-1981393487258?aff=oddtdtcreator",
    ctaLabel: "Get tickets on Eventbrite",
    date: "Sunday, March 8, 2026 · 4pm–9pm",
    location: "Verdi Convention Centre, Mississauga, ON",
  },
];

const testimonials = [
  { quote: "Ramadan Giving helped our family during the most difficult time. Their support was a blessing.", author: "Sarah M.", location: "Toronto, CA" },
  { quote: "The transparency and care this organization shows is unmatched. Every dollar makes a real impact.", author: "Omar K.", location: "Toronto, CA" },
  { quote: "I've been volunteering for 3 years. The dedication of this team inspires me every day.", author: "Fatima A.", location: "Toronto, CA" }
];

const partners = ["Local Mosques", "Community Centers", "Food Banks", "Schools"];

export default function Home() {
  const router = useRouter();
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  return (
    <div className="space-y-0 overflow-x-hidden">
      <HeroSection onDonateClick={() => setDonationModalOpen(true)} />

      {/* Our Impact Section - White bg */}
      <section className="py-10 bg-card px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[32px] md:text-[40px] font-bold text-foreground text-center mb-8">Our Impact</h2>
          <BentoGrid />
        </div>
      </section>

      {/* Current events */}
      <CurrentEvents events={currentEvents} sectionSubtitle="Join us at upcoming events" />

      {/* Timeline - Beige bg */}
      <section className="py-10 bg-background px-4">
        <div className="max-w-6xl mx-auto"><ImpactTimeline /></div>
      </section>

      {/* Our Programs Section - White bg */}
      <section className="py-10 bg-card px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[32px] md:text-[40px] font-bold text-foreground text-center mb-2">Our Programs</h2>
          <p className="text-muted-foreground text-center mb-8">Making a difference through targeted initiatives</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/50 overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                <Heart className="w-12 h-12 text-primary" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2">Hunger Relief</h3>
                <p className="text-sm text-muted-foreground">Providing meals and groceries to families in need throughout the year.</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center">
                <Users className="w-12 h-12 text-gold" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2">Community Support</h3>
                <p className="text-sm text-muted-foreground">Winter relief kits, clothing drives, and essential supplies for vulnerable families.</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary/30 to-gold/10 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-primary" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2">Emergency Aid</h3>
                <p className="text-sm text-muted-foreground">Rapid response to crises and ongoing support for affected communities worldwide.</p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-6">
            <Button variant="outline" onClick={() => router.push("/programs")} className="rounded-xl">View All Programs</Button>
          </div>
        </div>
      </section>

      {/* Community Carousel (Team Section) - Beige bg */}
      <section className="py-10 bg-background px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[32px] md:text-[40px] font-bold text-foreground text-center mb-2">Faces of Our Community</h2>
          <p className="text-muted-foreground text-center mb-8">Real people making real impact. Meet the dedicated individuals behind Ramadan Giving.</p>
          <CommunityCarousel />
        </div>
      </section>

      {/* Community Voices (Testimonials Section) - White bg */}
      <section className="py-10 bg-card px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-[32px] md:text-[40px] font-bold text-foreground mb-2">Community Voices</h2>
          <p className="text-muted-foreground">Hear from the people we serve</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center"><Quote className="w-8 h-8 text-gold" /></div>
              <blockquote className="text-foreground italic text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">"{testimonials[testimonialIndex].quote}"</blockquote>
              <div><p className="font-bold text-foreground text-lg">{testimonials[testimonialIndex].author}</p><p className="text-muted-foreground">{testimonials[testimonialIndex].location}</p></div>
              <div className="flex justify-center gap-2 pt-4">
                {testimonials.map((_, idx) => (<button key={idx} onClick={() => setTestimonialIndex(idx)} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === testimonialIndex ? "w-8 bg-gold" : "bg-muted-foreground/30"}`} />))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Partners - Beige bg */}
      <section className="py-10 bg-background px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[32px] md:text-[40px] font-bold text-foreground text-center mb-8">Our Partners & Supporters</h2>
          <Card className="border-border/50 border-2 border-gold/20 overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6"><Building2 className="w-6 h-6 text-primary" /><span className="text-lg font-semibold text-foreground">Community Partners</span></div>
              <div className="flex flex-wrap gap-3 mb-6">{partners.map((partner) => (<Badge key={partner} variant="secondary" className="px-4 py-2 text-sm">{partner}</Badge>))}</div>
              <p className="text-muted-foreground">Serving communities since 2021 • Registered NPO under Bridging Borders</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Volunteer CTA - Full width solid teal bg, no bottom margin */}
      <section className="py-12 bg-primary w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Users className="w-12 h-12 text-primary-foreground/80 mx-auto mb-4" />
          <h2 className="text-[32px] md:text-[40px] font-bold text-primary-foreground mb-3">Ready to Make a Difference?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">Join thousands of donors and volunteers who are transforming lives.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => setDonationModalOpen(true)} className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold rounded-xl"><Heart className="w-4 h-4 mr-2" />Donate Now</Button>
            <Button size="lg" onClick={() => router.push("/get-involved")} className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold rounded-xl"><Users className="w-4 h-4 mr-2" />Get Involved</Button>
          </div>
        </div>
      </section>

      <SmartDonationModal open={donationModalOpen} onOpenChange={setDonationModalOpen} />
    </div>
  );
}
