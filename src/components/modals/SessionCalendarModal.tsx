import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";

interface SessionCalendarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionCalendarModal({
  open,
  onOpenChange,
}: SessionCalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Mock session data
  const sessions = {
    "2024-01-15": [
      { time: "9:00 AM", client: "Emma Thompson", type: "Individual" },
      { time: "2:00 PM", client: "Michael Chen", type: "Couples" },
    ],
    "2024-01-16": [
      { time: "10:00 AM", client: "Sarah Johnson", type: "Individual" },
    ],
    "2024-01-17": [
      { time: "11:00 AM", client: "David Wilson", type: "Family" },
      { time: "3:00 PM", client: "Lisa Rodriguez", type: "Individual" },
    ],
    "2024-01-22": [
      { time: "9:00 AM", client: "Emma Thompson", type: "Individual" },
    ],
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const days = getDaysInMonth(currentDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Session Calendar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Weekday headers */}
            {weekdays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground p-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="p-2" />;
              }

              const dateKey = formatDateKey(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day,
              );
              const daySessions = sessions[dateKey] || [];
              const isToday =
                new Date().toDateString() ===
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day,
                ).toDateString();

              return (
                <Card
                  key={day}
                  className={`min-h-[100px] cursor-pointer hover:bg-muted/50 transition-colors ${
                    isToday ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <CardContent className="p-2">
                    <div
                      className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {daySessions.slice(0, 2).map((session, sessionIndex) => (
                        <div
                          key={sessionIndex}
                          className="text-xs p-1 bg-primary/10 rounded text-primary truncate"
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.time}
                          </div>
                          <div className="truncate">{session.client}</div>
                        </div>
                      ))}
                      {daySessions.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{daySessions.length - 2} more
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/10 rounded"></div>
              <span className="text-sm text-muted-foreground">
                Scheduled Sessions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-primary rounded"></div>
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">28</div>
                <div className="text-sm text-muted-foreground">This Month</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent">7</div>
                <div className="text-sm text-muted-foreground">This Week</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-muted-foreground">Today</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
