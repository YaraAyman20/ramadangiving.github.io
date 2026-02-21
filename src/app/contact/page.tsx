"use client";

import { Mail, MapPin, Clock, ExternalLink, MessageCircle, HelpCircle, Instagram, Linkedin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Donations",
    questions: [
      {
        q: "Can I get a tax receipt for my donation?",
        a: "No, Ramadan Giving does not provide tax receipts. 100% of donations go directly to funding programs and services."
      },
      {
        q: "How will my donation be used?",
        a: "Every donation directly supports programs that provide food, clothing, hygiene products, camp activities, and psychosocial support to underserved communities locally in the GTA and globally."
      },
      {
        q: "Can I give in other ways besides money?",
        a: "Yes! You can donate goods, services, or even storage space. In-kind contributions help us provide direct support to families and individuals in need. Contact us at givingramadan@gmail.com to discuss."
      },
      {
        q: "Can I make a recurring donation?",
        a: "Yes! You can set up monthly recurring donations to provide consistent support. This helps us plan and deliver programs more effectively throughout the year."
      }
    ]
  },
  {
    category: "Volunteering",
    questions: [
      {
        q: "Who can volunteer with Ramadan Giving?",
        a: "Anyone passionate about making a difference—students, families, professionals, or groups—can volunteer with us."
      },
      {
        q: "How can I volunteer?",
        a: "Check our calendar on this website or follow us on social media for upcoming initiatives. You can also sign up as an event-based volunteer using our volunteer form on the Get Involved page."
      },
      {
        q: "Are there remote volunteer opportunities?",
        a: "Yes! You can help with social media, outreach, fundraising, or administrative tasks from anywhere."
      }
    ]
  },
  {
    category: "Governance & Impact",
    questions: [
      {
        q: "Do you only serve Muslim communities?",
        a: "No. Despite the name Ramadan Giving, we serve all communities and faiths. Our mission is to support anyone in need, regardless of religion, background, or identity."
      },
      {
        q: "Who runs Ramadan Giving?",
        a: "Ramadan Giving was founded by Nora Abdalaal and is guided by a dedicated group of directors. It operates under Bridging Borders, a government-registered non-profit organization."
      },
      {
        q: "How can I learn more about your programs and impact?",
        a: "Visit our Programs & Impact page or follow us on social media for updates, stories, and ways to get involved."
      }
    ]
  }
];

const socialLinks = [
  { name: "Instagram", url: "https://www.instagram.com/ramadan.giving?igsh=MXJqZjJnNWRqNzY3eg==", icon: Instagram },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/ramadan-giving", icon: Linkedin },
];

export default function Contact() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto px-4">
      {/* Header */}
      <section className="text-center space-y-4 pt-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Contact & FAQ</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions? Find answers below or reach out to us directly.
        </p>
      </section>

      {/* Contact Info */}
      <section className="grid md:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Get in Touch
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">givingramadan@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="font-medium text-foreground">Within 48 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-gold" />
              Follow Us
            </h2>
            <p className="text-muted-foreground text-sm">
              Stay connected with our latest updates, events, and impact stories.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="outline"
                  className="rounded-xl gap-2"
                  onClick={() => window.open(link.url, "_blank")}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Button>
              ))}
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Serving communities across Canada & internationally
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          Frequently Asked Questions
        </h2>

        {faqs.map((category) => (
          <Card key={category.category} className="border-border/50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gold mb-3">{category.category}</h3>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, idx) => (
                  <AccordionItem key={idx} value={`${category.category}-${idx}`} className="border-b-0">
                    <AccordionTrigger className="text-left text-foreground hover:no-underline py-3">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Contact Form CTA */}
      <section>
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6 text-center space-y-4">
            <Mail className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-lg font-bold text-foreground">Still Have Questions?</h3>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Send us an email and we'll get back to you within 48 hours.
            </p>
            <Button 
              className="rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground"
              onClick={() => window.location.href = "mailto:givingramadan@gmail.com"}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Us
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
