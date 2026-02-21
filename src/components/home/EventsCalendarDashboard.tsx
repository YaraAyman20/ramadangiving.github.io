import { useState } from "react";
import { MapPin, ExternalLink, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  date: Date;
  title: string;
  time: string;
  location: string;
  details: string;
  signupLink?: string;
  signupStatus: "open" | "closed" | "coming-soon" | "internal";
  igLink?: string;
  isPast?: boolean;
}

const events: Event[] = [
  // Past Events
  {
    id: "past-1",
    date: new Date(2025, 11, 27),
    title: "Youth Shelter Outreach & Winter Kit Distribution",
    time: "Saturday, December 27, 2025",
    location: "Downtown Toronto (exact location shared upon sign-up)",
    details: "Distribution of winter kits and essential supplies to youth shelters to support individuals facing cold-weather insecurity.",
    signupStatus: "closed",
    isPast: true,
  },
  {
    id: "past-2",
    date: new Date(2026, 0, 4),
    title: "Ramadan Giving New Year Kickoff Meeting",
    time: "Sunday, January 4, 2026",
    location: "Virtual (link shared upon registration)",
    details: "Team-wide meeting to align on goals, events, and priorities for the year ahead.",
    signupStatus: "internal",
    isPast: true,
  },
  {
    id: "past-3",
    date: new Date(2026, 0, 16),
    title: "Community Fundraiser at Local Mosque",
    time: "Thursday, January 16, 2026",
    location: "Hamilton Mountain Mosque",
    details: "Community tabling and fundraising to support upcoming winter and Ramadan programming.",
    signupStatus: "closed",
    isPast: true,
  },
  {
    id: "past-4",
    date: new Date(2026, 0, 18),
    title: "Winter Kits & Hot Meals for the Unhoused (with Keep Hamilton Warm)",
    time: "Saturday, January 18, 2026",
    location: "Hamilton",
    details: "Joint outreach providing winter kits and hot meals to unhoused community members.",
    signupStatus: "closed",
    isPast: true,
  },
  // Upcoming Events
  {
    id: "1",
    date: new Date(2026, 0, 24),
    title: "Hot Meals & Winter Kits – Waterloo Edition (with Rommana Café)",
    time: "Friday, January 24, 2026",
    location: "Waterloo",
    details: "Community-led hot meal service and winter kit distribution in partnership with a local business.",
    signupLink: "https://linktr.ee/ramadangiving",
    signupStatus: "open",
  },
  {
    id: "2",
    date: new Date(2026, 1, 16),
    title: "Wellness Day for Women Affected by Cancer",
    time: "Sunday, February 16, 2026",
    location: "Toronto (venue TBD)",
    details: "A restorative day focused on care, connection, and empowerment for women affected by cancer, featuring workshops and wellness activities.",
    signupStatus: "coming-soon",
  },
  {
    id: "3",
    date: new Date(2026, 1, 22),
    title: "Community Halaqa, Lunch Bag Distribution & Iftaar",
    time: "Sunday, February 22, 2026",
    location: "GTA (location TBD)",
    details: "Spiritual reflection, community connection, and outreach through lunch bag distribution and shared iftaar.",
    signupStatus: "coming-soon",
  },
  {
    id: "4",
    date: new Date(2026, 2, 8),
    title: "Family Grocery Distribution, Toy Drive & Community Iftaar",
    time: "Sunday, March 8, 2026",
    location: "GTA (location TBD)",
    details: "Supporting families through grocery packs, children's toys, and a communal iftaar gathering.",
    signupStatus: "coming-soon",
  },
  {
    id: "gala",
    date: new Date(2026, 2, 15),
    title: "Ramadan Giving Annual Fundraising Gala",
    time: "Sunday, March 15, 2026 – Evening (Maghrib ~7:24 PM)",
    location: "Venue TBD",
    details: "Signature fundraising event bringing the community together to support relief and year-round programming.",
    signupStatus: "coming-soon",
  },
  {
    id: "5",
    date: new Date(2026, 3, 11),
    title: "RG x SMILE Camp for Children with Disabilities & Pop-Up Store",
    time: "Saturday, April 11, 2026",
    location: "Safa and Marwa School, Mississauga",
    details: "A joyful day camp experience for children with disabilities, including activities, care, and a community pop-up store.",
    signupStatus: "coming-soon",
  },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function EventsCalendarDashboard() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [showPast, setShowPast] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  const eventDates = events.map(e => e.date.toDateString());

  const hasEvent = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return eventDates.includes(date.toDateString());
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return selectedDate.toDateString() === date.toDateString();
  };

  const isToday = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === today.toDateString();
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (selectedDate?.toDateString() === date.toDateString()) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const upcomingEvents = events.filter(e => !e.isPast && e.date >= todayStart);
  const pastEvents = events.filter(e => e.isPast || e.date < todayStart);

  const filteredEvents = selectedDate
    ? events.filter(e => e.date.toDateString() === selectedDate.toDateString())
    : showPast
      ? pastEvents
      : upcomingEvents;

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const getSignupButton = (event: Event) => {
    if (event.signupStatus === "closed") {
      return <Badge variant="secondary" className="text-xs">Sign Up: CLOSED</Badge>;
    }
    if (event.signupStatus === "internal") {
      return <Badge variant="outline" className="text-xs">Internal Team</Badge>;
    }
    if (event.signupStatus === "coming-soon") {
      return <Badge variant="outline" className="text-xs text-muted-foreground">Sign Up: Coming Soon</Badge>;
    }
    if (event.signupLink) {
      return (
        <Button
          size="sm"
          className="h-7 text-xs rounded-lg bg-gold hover:bg-gold/90 text-gold-foreground"
          onClick={(e) => { e.stopPropagation(); window.open(event.signupLink, "_blank"); }}
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Sign Up
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Toggle past/upcoming */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={!showPast ? "default" : "outline"}
          className="rounded-xl"
          onClick={() => { setShowPast(false); setSelectedDate(null); }}
        >
          Upcoming Events
        </Button>
        <Button
          size="sm"
          variant={showPast ? "default" : "outline"}
          className="rounded-xl"
          onClick={() => { setShowPast(true); setSelectedDate(null); }}
        >
          Past Events
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            {/* Month Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              >
                ←
              </Button>
              <span className="font-semibold text-foreground">{monthName}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              >
                →
              </Button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} className="w-full aspect-square" />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayHasEvent = hasEvent(day);
                const dayIsSelected = isSelected(day);
                const dayIsToday = isToday(day);

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      "w-full aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors relative",
                      dayIsSelected
                        ? "bg-[#c0a34e] text-white font-bold"
                        : dayIsToday
                          ? "ring-2 ring-primary font-bold text-primary"
                          : dayHasEvent
                            ? "bg-gold/20 text-gold font-semibold hover:bg-gold/30"
                            : "text-foreground hover:bg-secondary"
                    )}
                  >
                    {day}
                    {dayHasEvent && !dayIsSelected && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-gold" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded ring-2 ring-primary" />
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <span>Has Event</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-[#c0a34e]" />
                <span>Selected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">
            {selectedDate
              ? `Events on ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
              : showPast
                ? "Past Events & Programs"
                : "Upcoming Events & Programs"}
          </h3>

          {filteredEvents.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-6 text-center text-muted-foreground">
                No events found for this date.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredEvents.map(event => (
                <Card key={event.id} className={cn("border-border/50 overflow-hidden", event.isPast && "opacity-75")}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-foreground text-sm leading-snug">{event.title}</p>
                      {event.isPast && <Badge variant="secondary" className="text-xs flex-shrink-0">Past</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {event.location}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{event.details}</p>
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {getSignupButton(event)}
                      {event.igLink && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs rounded-lg"
                          onClick={() => window.open(event.igLink, "_blank")}
                        >
                          <Instagram className="w-3 h-3 mr-1" />
                          View Post
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Follow{" "}
            <button
              className="text-primary underline"
              onClick={() => window.open("https://www.instagram.com/ramadan.giving", "_blank")}
            >
              @ramadan.giving
            </button>
            {" "}on Instagram for event updates and sign-up links.
          </p>
        </div>
      </div>
    </div>
  );
}
