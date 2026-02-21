"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function PurposeMission() {
    const router = useRouter();

    return (
        <section className="py-16 md:py-20 bg-background px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-[32px] md:text-[40px] font-bold text-foreground">
                    Our Purpose & Mission
                </h2>

                <div className="space-y-6">
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        We support individuals experiencing homelessness, refugee families, and vulnerable
                        communities across the Greater Toronto Area and internationally, including in Cairo,
                        Egypt. Our programs provide food, clothing, hygiene, educational resources, and relief
                        aid, while fostering connection and hope.
                    </p>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        Our mission is to reduce socioeconomic inequities by empowering underserved
                        communities locally and globally through compassionate, community-driven support
                        rooted in dignity, generosity, and faith-inspired service.
                    </p>
                </div>

                <div className="pt-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => router.push("/about")}
                        className="rounded-xl px-8 h-12 text-base font-medium border-border hover:bg-secondary group"
                    >
                        Learn More About Us
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
