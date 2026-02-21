"use client";

import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const barData = [
    { name: "Meals Served", value: 25000, fill: "#0a4b59" },
    { name: "Lunch Bags", value: 5000, fill: "#c0a34e" },
    { name: "Families Helped", value: 3500, fill: "#0a4b59" },
    { name: "Students Supported", value: 1200, fill: "#c0a34e" },
];

const pieData = [
    { name: "Hunger Relief", value: 45, color: "#0a4b59" },
    { name: "Community Support", value: 25, color: "#c0a34e" },
    { name: "Emergency Aid", value: 20, color: "#1a6b7a" },
    { name: "Education", value: 10, color: "#d4b85c" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                <p className="font-semibold text-foreground text-sm">{label || payload[0].name}</p>
                <p className="text-muted-foreground text-sm">
                    {typeof payload[0].value === "number" && payload[0].value > 100
                        ? payload[0].value.toLocaleString()
                        : `${payload[0].value}%`}
                </p>
            </div>
        );
    }
    return null;
};

export function ImpactCharts() {
    return (
        <section className="py-16 md:py-20 bg-card px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-[32px] md:text-[40px] font-bold text-foreground mb-3">
                        Our Impact
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Real numbers, real change. Click any chart to view Impact Reports.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bar Chart */}
                    <Card className="border-border/50 overflow-hidden">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-foreground mb-4 text-lg">
                                Community Reach
                            </h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 12 }}
                                            className="fill-muted-foreground"
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            className="fill-muted-foreground"
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="value"
                                            radius={[8, 8, 0, 0]}
                                        >
                                            {barData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pie Chart */}
                    <Card className="border-border/50 overflow-hidden">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-foreground mb-4 text-lg">
                                Fund Allocation
                            </h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={4}
                                            dataKey="value"
                                            label={({ name, value }) => `${name} ${value}%`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            verticalAlign="bottom"
                                            iconType="circle"
                                            formatter={(value: string) => (
                                                <span className="text-muted-foreground text-sm">{value}</span>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {[
                        { value: "$320,000+", label: "Total Raised" },
                        { value: "5,000+", label: "Lunch Bags" },
                        { value: "100%", label: "Volunteer Led" },
                        { value: "Registered", label: "Non-Profit (NPO)" },
                    ].map((stat) => (
                        <Card key={stat.label} className="border-border/50">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl md:text-3xl font-bold text-gold">{stat.value}</p>
                                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
