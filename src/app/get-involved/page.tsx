"use client";

import { Users, Briefcase, Mail, Heart, Building2, HandHeart, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function GetInvolved() {
  const router = useRouter();

  return (
    <div className="space-y-12 max-w-4xl mx-auto px-4 pb-12">
      {/* Header */}
      <section className="text-center space-y-4 pt-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Get Involved</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          There are many ways to support Ramadan Giving beyond donating. Whether you volunteer your time, support as a sponsor, or collaborate as an organization, we welcome everyone who shares our commitment to compassionate, community-driven service.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2 text-sm text-muted-foreground">
          <span className="px-4 py-2 rounded-full bg-secondary">Volunteer with us</span>
          <span className="px-4 py-2 rounded-full bg-secondary">Sponsor our programs</span>
          <span className="px-4 py-2 rounded-full bg-secondary">Partner or collaborate</span>
          <span className="px-4 py-2 rounded-full bg-secondary">Engage as a corporate or community group</span>
        </div>
      </section>

      {/* Volunteer Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <HandHeart className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Volunteer With Us</h2>
        </div>
        <p className="text-muted-foreground">
          Volunteers are the heart of Ramadan Giving. Our work is powered by community members who show up with care, consistency, and a willingness to serve. There are two ways to volunteer, depending on your availability and level of involvement.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Event-Based */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent flex flex-col">
            <CardContent className="p-6 space-y-4 flex flex-col flex-1">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <HandHeart className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-bold text-foreground">Event-Based Volunteers</h3>
                <p className="text-sm text-muted-foreground">
                  Open year-round. Ideal for those looking to volunteer on a flexible basis. No prior experience required — students, families, professionals, and community members are all welcome.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Roles may include:</p>
                  <ul className="space-y-1">
                    {[
                      "Event setup, logistics, and takedown",
                      "Packing and distributing meals, grocery bags, and care kits",
                      "Community outreach and on-site support",
                      "Fundraising and awareness activities",
                    ].map((role) => (
                      <li key={role} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button
                className="w-full rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground"
                onClick={() => window.open("https://forms.gle/LZo8W75vPQj2vcgA8", "_blank")}
              >
                <HandHeart className="w-4 h-4 mr-2" />
                Sign Up to Volunteer
              </Button>
            </CardContent>
          </Card>

          {/* Planning Team */}
          <Card className="border-border/50 bg-gradient-to-br from-gold/5 to-transparent flex flex-col">
            <CardContent className="p-6 space-y-4 flex flex-col flex-1">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-gold" />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-bold text-foreground">Planning & Core Team</h3>
                <p className="text-sm text-muted-foreground">
                  Our Planning & Core Team supports the coordination, planning, and delivery of Ramadan Giving's programs year-round. These roles involve a higher level of responsibility and a more consistent time commitment.
                </p>
                <p className="text-sm text-muted-foreground">
                  While official applications are currently closed, individuals interested in joining the Planning & Core Team are welcome to email us to express their interest. Opportunities may open during the year based on organizational needs.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => window.location.href = "mailto:givingramadan@gmail.com?subject=Planning Team Interest"}
              >
                <Mail className="w-4 h-4 mr-2" />
                Express Your Interest
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sponsor / Partner Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Partner With Ramadan Giving</h2>
        </div>
        <p className="text-muted-foreground">
          Corporate sponsors, community organizations, and institutions can make a lasting difference in the lives of underserved families locally and globally.
        </p>

        {/* Impact Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "2,449+", label: "Hot meals & lunch bags served" },
            { value: "335+", label: "Children supported through camps & gift programs" },
            { value: "GTA & abroad", label: "Programs reaching vulnerable families" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="font-bold text-gold text-lg">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ways to Collaborate */}
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-foreground">Ways to Collaborate</h3>
              <ul className="space-y-2">
                {[
                  "Financial sponsorship for high-impact programs",
                  "In-kind donations of goods or services",
                  "Event partnerships and co-branded initiatives",
                  "Long-term program collaborations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Why Partner */}
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-foreground">Why Partner With Us</h3>
              <ul className="space-y-3">
                {[
                  { title: "Be Seen", desc: "Recognition at events, on our website, and social media" },
                  { title: "Make Real Change", desc: "Directly improve lives of families and children in need" },
                  { title: "Strategic Connections", desc: "Join a network of organizations and volunteers driving community impact" },
                ].map((item) => (
                  <li key={item.title} className="text-sm">
                    <span className="font-semibold text-foreground">{item.title}</span>
                    <span className="text-muted-foreground"> – {item.desc}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Ready to Collaborate?</h3>
              <p className="text-muted-foreground mt-2">
                Reach out to discuss partnership opportunities and how we can work together.
              </p>
            </div>
            <div className="pt-2">
              <p className="text-lg font-semibold text-gold">givingramadan@gmail.com</p>
              <p className="text-sm text-muted-foreground mt-1">We typically respond within 48 hours</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground"
                onClick={() => window.location.href = "mailto:givingramadan@gmail.com?subject=Partnership Inquiry"}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Partner With Us
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => router.push("/contact")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
