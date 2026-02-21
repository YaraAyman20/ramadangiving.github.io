import { useState } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  date: Date;
  title: string;
  time: string;
  location: string;
  image: string;
}

const events: Event[] = [
  {
    id: "1",
    date: new Date(2025, 0, 15),
    title: "Winter Clothing Drive",
    time: "10:00 AM - 2:00 PM",
    location: "Community Center",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&q=80"
  },
  {
    id: "2",
    date: new Date(2025, 0, 22),
    title: "Food Pantry Distribution",
    time: "9:00 AM - 1:00 PM",
    location: "Main Mosque",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80"
  },
  {
    id: "3",
    date: new Date(2025, 1, 5),
    title: "Youth Tutoring Session",
    time: "3:00 PM - 5:00 PM",
    location: "Public Library",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&q=80"
  },
  {
    id: "4",
    date: new Date(2025, 1, 14),
    title: "Senior Care Visit",
    time: "11:00 AM - 3:00 PM",
    location: "Sunset Home",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80"
  },
  {
    id: "5",
    date: new Date(2025, 1, 28),
    title: "Community Iftar Prep",
    time: "4:00 PM - 8:00 PM",
    location: "Islamic Center",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=80"
  }
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function EventsCalendarDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1)); // January 2025

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

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (selectedDate?.toDateString() === date.toDateString()) {
      setSelectedDate(null); // Toggle off
    } else {
      setSelectedDate(date);
    }
  };

  const filteredEvents = selectedDate
    ? events.filter(e => e.date.toDateString() === selectedDate.toDateString())
    : events.filter(e => e.date >= new Date()); // Show upcoming by default

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
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
              {/* Empty cells for days before the 1st */}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} className="w-full aspect-square" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayHasEvent = hasEvent(day);
                const dayIsSelected = isSelected(day);

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      "w-full aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors relative",
                      dayIsSelected
                        ? "bg-[#c0a34e] text-white font-bold"
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
              : "Upcoming Events"}
          </h3>

          {filteredEvents.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-6 text-center text-muted-foreground">
                No events found for this date.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredEvents.map(event => (
                <Card key={event.id} className="border-border/50 overflow-hidden">
                  <div className="flex">
                    <div
                      className="w-24 h-24 bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${event.image})` }}
                    />
                    <CardContent className="p-3 flex-1">
                      <p className="font-semibold text-foreground text-sm line-clamp-1">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {event.time}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                      <Button
                        size="sm"
                        className="mt-2 h-7 text-xs rounded-lg bg-gold hover:bg-gold/90 text-gold-foreground"
                        onClick={() => window.open("https://www.instagram.com/ramadan.giving", "_blank")}
                      >
                        RSVP
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
