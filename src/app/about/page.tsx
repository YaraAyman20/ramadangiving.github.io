"use client";

import { Heart, Target, Eye, Shield, Users, Award, MapPin, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommunityCarousel } from "@/components/home/CommunityCarousel";

const team = [
  { name: "Nora Abdalaal", role: "Founder & Executive Director", initials: "NA", bio: "Nora founded Ramadan Giving in 2021 after witnessing the need in local communities. Her passion for community service and dedication to transparency has shaped our organization's values and growth." },
  { name: "Fatima Ali", role: "Operations Director", initials: "FA" },
  { name: "Omar Khan", role: "Outreach Coordinator", initials: "OK" },
  { name: "Aisha Rahman", role: "Volunteer Manager", initials: "AR" },
];

export default function About() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto px-4">
      {/* Hero */}
      <section className="text-center space-y-4 pt-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">About Ramadan Giving</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A grassroots charity dedicated to serving those in need, rooted in compassion and transparency.
        </p>
      </section>

      {/* Origin Story */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Our Story
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Ramadan Giving began in 2021 as a small community initiative during the blessed month of Ramadan. What started as a few volunteers distributing meals to the unhoused in Toronto has grown into a movement serving thousands across multiple programs.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our founder, Nora Abdalaal, witnessed firsthand the struggles of families in our community—parents skipping meals so their children could eat, elderly neighbors unable to afford heating in winter. She knew something had to change.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we remain true to our grassroots origins: a volunteer-led organization where every dollar goes directly to those who need it most. In 2025, we became a registered NPO under Bridging Borders.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Our Mission</h3>
            <p className="text-muted-foreground">
              To provide immediate relief and sustainable support to vulnerable communities through food security, emergency aid, education assistance, and community empowerment programs.
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-accent/5 to-transparent">
          <CardContent className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Our Vision</h3>
            <p className="text-muted-foreground">
              A world where no family goes hungry, no child lacks educational resources, and every community has the support it needs to thrive with dignity and hope.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Transparency & Accountability */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-gold" />
          Transparency & Accountability
        </h2>
        <Card className="border-border/50 border-2 border-gold/30">
          <CardContent className="p-6 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We believe donors have the right to know exactly how their contributions are used. That's why we maintain complete transparency in all our operations:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold text-sm font-bold">✓</span>
                </div>
                <span className="text-muted-foreground">100% of Zakat donations go directly to eligible recipients</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold text-sm font-bold">✓</span>
                </div>
                <span className="text-muted-foreground">Annual financial reports available to all donors</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold text-sm font-bold">✓</span>
                </div>
                <span className="text-muted-foreground">Registered NPO under Bridging Borders umbrella</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold text-sm font-bold">✓</span>
                </div>
                <span className="text-muted-foreground">Regular impact reports with photos and testimonials</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Meet the Founder */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Meet the Founder
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-2xl">NA</span>
              </div>
              <div className="space-y-3 text-center md:text-left">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{team[0].name}</h3>
                  <p className="text-sm text-gold font-medium">{team[0].role}</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {team[0].bio}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Meet the Team */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Meet the Team
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <p className="text-muted-foreground">
              Ramadan Giving is proudly volunteer-led. Our team consists of dedicated community members who donate their time and skills to serve others. We operate on a grassroots model—no excessive overhead, no corporate bureaucracy.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {team.slice(1).map((member) => (
                <div key={member.name} className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">{member.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Our Locations */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gold" />
          Our Locations
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <p className="text-muted-foreground">
              We serve communities across multiple cities, with our primary operations based in Toronto.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Toronto, ON", "Mississauga, ON", "Brampton, ON", "Scarborough, ON"].map((city) => (
                <div key={city} className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{city}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Our Partners & Community */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Our Partners & Community
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <p className="text-muted-foreground">
              We're proud to work alongside these organizations and community partners.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Local Mosques", "Community Centers", "Food Banks", "Schools", "Islamic Centers", "Youth Organizations", "Senior Homes", "Medical Clinics"].map((partner) => (
                <div key={partner} className="h-20 rounded-xl bg-secondary/50 border border-border/30 flex items-center justify-center p-4">
                  <span className="text-sm text-foreground font-medium text-center">{partner}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
      {/* Faces of Our Community */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Faces of Our Community
        </h2>
        <p className="text-muted-foreground">
          Real people making real impact. Meet the dedicated individuals behind Ramadan Giving.
        </p>
        <CommunityCarousel />
      </section>
    </div>
  );
}
