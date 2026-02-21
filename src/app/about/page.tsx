"use client";

import { Heart, Target, Eye, Shield, Users, Award, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CommunityCarousel } from "@/components/home/CommunityCarousel";

const values = [
  { title: "Sincerity", description: "Serving for the sake of goodness, not recognition" },
  { title: "Dignity First", description: "Honouring every individual with respect and privacy" },
  { title: "Empathy & Compassion", description: "Responding to real needs with care and understanding" },
  { title: "Unity & Community", description: "Strong service begins with strong relationships" },
  { title: "Accountability", description: "Showing up reliably for those who depend on us" },
  { title: "Striving for Excellence", description: "Giving our best because service deserves care" },
];

export default function About() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto px-4">
      {/* Hero */}
      <section className="text-center space-y-4 pt-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">About Ramadan Giving</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A community-led humanitarian initiative addressing socioeconomic inequities locally and globally since 2021.
        </p>
      </section>

      {/* Who We Are */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Who We Are
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Ramadan Giving is a community-led humanitarian initiative addressing socioeconomic inequities locally and globally since 2021. Founded during the COVID-19 pandemic, Ramadan Giving began as a grassroots effort to support families experiencing hardship during a time of isolation. What started with delivering non-perishable food packages has grown into a year-round movement rooted in compassion, dignity, and hope.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Who We Serve */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Who We Serve & What We Do
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We support individuals experiencing homelessness, refugee families, and vulnerable communities across the Greater Toronto Area and internationally, including in Cairo, Egypt. Our programs provide food, clothing, hygiene, educational resources, and relief aid, while fostering connection and hope.
            </p>
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <p className="font-semibold text-foreground text-sm">Core Programs</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>🍲 Supporting the Unhoused – Meals, hygiene kits, and personal care initiatives</li>
                  <li>🎨 Empowering Children & Families – Camps, gift bags, and community resources</li>
                  <li>🤝 Community Building – Halaqas, potlucks, and local/global engagement events</li>
                  <li>🌍 International Relief – Support for orphans and families in crisis abroad</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground text-sm">Impact Highlights</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Thousands of grocery packages and meals to refugee and unhoused communities</li>
                  <li>Hundreds of hot meals, winter kits, hygiene kits, and toys to families and shelters</li>
                  <li>Day camps for 100+ refugee, orphaned, and vulnerable children in GTA and Cairo</li>
                  <li>$517,000+ raised for Gaza relief and humanitarian assistance</li>
                </ul>
              </div>
            </div>
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
              To reduce socioeconomic inequities by empowering underserved communities locally and globally through compassionate, community-driven support rooted in dignity, generosity, and faith-inspired service.
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
              Humans supporting humans. We envision communities coming together so everyone, everywhere, can live with dignity, care, compassion, and opportunity.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Our Values */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          Our Values
        </h2>
        <p className="text-muted-foreground">
          Our work is guided by faith-inspired service and driven by sincerity, humility, and responsibility.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {values.map((value) => (
            <Card key={value.title} className="border-border/50">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{value.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{value.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Volunteer-Led Model */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          A Volunteer-Led, Grassroots Model
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Ramadan Giving is powered entirely by volunteers. Our team includes lead directors, committee directors, project managers, and general volunteers who collectively plan, fundraise, and deliver programming. We operate through clearly defined committees covering logistics, case management, fundraising, finance, marketing, web, and public relations—ensuring both impact and accountability.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This structure allows us to remain flexible, community-responsive, and deeply connected to the people we serve. Our programming is inclusive and serves all people regardless of faith, background, or identity.
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
              Ramadan Giving is committed to trust and transparency. Funds raised through community-led initiatives are carefully tracked and allocated toward direct programming and relief efforts. Our finance and governance processes ensure responsible stewardship of donations, clear reporting, and long-term sustainability.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold text-sm font-bold">✓</span>
                </div>
                <span className="text-muted-foreground">100% of donations support direct programming and relief efforts</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold text-sm font-bold">✓</span>
                </div>
                <span className="text-muted-foreground">Responsible stewardship with clear reporting and governance processes</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold text-sm font-bold">✓</span>
                </div>
                <span className="text-muted-foreground">Operates under Bridging Borders, a government-registered non-profit organization</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold text-sm font-bold">✓</span>
                </div>
                <span className="text-muted-foreground">Regular impact updates with photos and stories from our programs</span>
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
                  <h3 className="text-lg font-bold text-foreground">Nora Abdalaal</h3>
                  <p className="text-sm text-gold font-medium">Founder</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Motivated by a deep commitment to unity and service, Nora Abdalaal founded Ramadan Giving under Bridging Borders with a vision to address systemic inequities through compassionate, community-driven action. Her leadership has brought together hundreds of volunteers and supporters, transforming small acts of care into large-scale impact.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Under her guidance, Ramadan Giving has grown from emergency food deliveries into a trusted, year-round organization delivering relief, building partnerships, and uplifting underserved communities locally and internationally.
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
          Meet Our Team
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Ramadan Giving is led by a diverse team of volunteers united by service. From logistics and fundraising, to outreach and storytelling, our team works collaboratively to ensure every initiative is delivered with care and dignity.
            </p>
            <p className="text-muted-foreground italic">More to come…</p>
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
