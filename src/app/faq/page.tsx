"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Heart, Shield, Users } from "lucide-react";
import Link from "next/link";

const faqCategories = [
  {
    title: "Donations",
    icon: Heart,
    items: [
      {
        question: "How will my donation be used?",
        answer: "Every donation directly supports programs that provide food, clothing, hygiene products, camp activities, and psychosocial support to underserved communities locally in the GTA and globally.",
      },
      {
        question: "Can I get a tax receipt for my donation?",
        answer: "No, Ramadan Giving does not provide tax receipts. 100% of donations go directly to funding programs and services.",
      },
      {
        question: "Do you only serve Muslim communities?",
        answer: "No. Despite the name Ramadan Giving, we serve all communities and faiths. Our mission is to support anyone in need, regardless of religion, background, or identity.",
      },
      {
        question: "Can I give in other ways besides money?",
        answer: "Yes! You can donate goods, services, or even storage space. In-kind contributions help us provide direct support to families and individuals in need. Contact us at givingramadan@gmail.com to discuss.",
      },
      {
        question: "Can I make a recurring donation?",
        answer: "Yes! You can set up monthly recurring donations to provide consistent support. This helps us plan and deliver programs more effectively throughout the year.",
      },
      {
        question: "Can I direct my donation to a specific program?",
        answer: "Absolutely! When donating, you can choose from specific programs like Winter Kits for the Unhoused, Grocery Packs, Meals for the Unhoused, Camps & Psychosocial Programs, and more. You can also select 'Where Most Needed' to let us allocate funds to our highest-priority initiatives.",
      },
    ],
  },
  {
    title: "Volunteering",
    icon: Users,
    items: [
      {
        question: "Who can volunteer with Ramadan Giving?",
        answer: "Anyone passionate about making a difference—students, families, professionals, or groups—can volunteer with us.",
      },
      {
        question: "How can I volunteer with Ramadan Giving?",
        answer: "Check our calendar on this website or follow us on social media for upcoming initiatives. Visit our Linktree to see upcoming events and sign up using the associated Google form for the opportunities that interest you. You can also fill out our general event-based volunteer sign-up form at any time.",
      },
      {
        question: "Are there remote volunteer opportunities?",
        answer: "Yes! You can help with social media, outreach, fundraising, or administrative tasks from anywhere.",
      },
      {
        question: "How do I join the Planning & Core Team?",
        answer: "Our Planning & Core Team applications are currently closed, but individuals interested are welcome to email us at givingramadan@gmail.com to express their interest. Opportunities may open during the year based on organizational needs.",
      },
    ],
  },
  {
    title: "Governance & Impact",
    icon: Shield,
    items: [
      {
        question: "Who runs Ramadan Giving?",
        answer: "Ramadan Giving was founded by Nora Abdalaal and is guided by a dedicated group of directors. It operates under Bridging Borders, a government-registered non-profit organization.",
      },
      {
        question: "Is Ramadan Giving a registered charity?",
        answer: "Ramadan Giving operates as an initiative under Bridging Borders, a government-registered non-profit organization (NPO) in Canada.",
      },
      {
        question: "Can I combine volunteering and donations?",
        answer: "Absolutely! Giving both your time and financial support creates a deeper, more meaningful impact.",
      },
      {
        question: "How can I learn more about your programs and impact?",
        answer: "Visit our Programs & Impact page or follow us on social media for updates, stories, and ways to get involved.",
      },
    ],
  },
];

export default function Faq() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4">
      {/* Header */}
      <div className="text-center space-y-4 pt-6">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about donations, volunteering, and how we operate.
        </p>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {faqCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <category.icon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {category.title}
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {category.items.map((item, itemIndex) => (
                <AccordionItem
                  key={itemIndex}
                  value={`${categoryIndex}-${itemIndex}`}
                  className="border border-border/50 rounded-xl px-4 bg-card"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="text-center p-8 bg-secondary/50 rounded-2xl">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Still have questions?
        </h3>
        <p className="text-muted-foreground mb-4">
          Our team is here to help. Reach out and we'll get back to you as soon as possible.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium transition-colors duration-200"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
