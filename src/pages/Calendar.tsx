import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  View,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendar.css";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  MapPin,
  Video,
  Phone,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ScheduleSessionModal } from "@/components/modals/ScheduleSessionModal";

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Types for calendar events
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    clientId: string;
    clientName: string;
    clientEmail: string;
    sessionType: "Individual" | "Couples" | "Family" | "Group";
    format: "In-Person" | "Telehealth" | "Phone";
    status: "Confirmed" | "Pending" | "Completed" | "Cancelled" | "No-Show";
    diagnosis: string;
    notes?: string;
    sessionNumber: number;
    duration: number;
    rate: number;
  };
}

interface CalendarFilters {
  sessionType: string;
  format: string;
  status: string;
  client: string;
}

const Calendar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showModal, ModalComponent } = useConfirmationModal();

  // State management
  const [currentView, setCurrentView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [eventDetailModalOpen, setEventDetailModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<CalendarFilters>({
    sessionType: "all",
    format: "all",
    status: "all",
    client: "all",
  });

  // Mock events data
  const mockEvents: CalendarEvent[] = [
    {
      id: "1",
      title: "Emma Thompson - Individual Therapy",
      start: new Date(2024, 11, 22, 9, 0), // December 22, 2024, 9:00 AM
      end: new Date(2024, 11, 22, 10, 0),
      resource: {
        clientId: "c1",
        clientName: "Emma Thompson",
        clientEmail: "emma.t@email.com",
        sessionType: "Individual",
        format: "In-Person",
        status: "Confirmed",
        diagnosis: "Generalized Anxiety Disorder",
        notes: "Focus on breathing techniques and cognitive restructuring",
        sessionNumber: 12,
        duration: 60,
        rate: 120,
      },
    },
    {
      id: "2",
      title: "Michael & Sarah Chen - Couples Therapy",
      start: new Date(2024, 11, 22, 10, 30),
      end: new Date(2024, 11, 22, 12, 0),
      resource: {
        clientId: "c2",
        clientName: "Michael & Sarah Chen",
        clientEmail: "m.chen@email.com",
        sessionType: "Couples",
        format: "Telehealth",
        status: "Confirmed",
        diagnosis: "Relationship Issues",
        notes: "Working on communication patterns and conflict resolution",
        sessionNumber: 8,
        duration: 90,
        rate: 150,
      },
    },
    {
      id: "3",
      title: "Sarah Johnson - Individual Therapy",
      start: new Date(2024, 11, 22, 13, 0),
      end: new Date(2024, 11, 22, 14, 0),
      resource: {
        clientId: "c3",
        clientName: "Sarah Johnson",
        clientEmail: "sarah.j@email.com",
        sessionType: "Individual",
        format: "In-Person",
        status: "Pending",
        diagnosis: "Major Depressive Disorder",
        notes: "Continue progress monitoring and medication compliance",
        sessionNumber: 15,
        duration: 60,
        rate: 120,
      },
    },
    {
      id: "4",
      title: "Wilson Family - Family Therapy",
      start: new Date(2024, 11, 23, 14, 30),
      end: new Date(2024, 11, 23, 15, 45),
      resource: {
        clientId: "c4",
        clientName: "Wilson Family",
        clientEmail: "d.wilson@email.com",
        sessionType: "Family",
        format: "In-Person",
        status: "Confirmed",
        diagnosis: "Teen Behavioral Issues",
        notes: "Include all family members, focus on communication",
        sessionNumber: 5,
        duration: 75,
        rate: 140,
      },
    },
    {
      id: "5",
      title: "Lisa Park - EMDR Session",
      start: new Date(2024, 11, 24, 16, 0),
      end: new Date(2024, 11, 24, 17, 0),
      resource: {
        clientId: "c5",
        clientName: "Lisa Park",
        clientEmail: "l.park@email.com",
        sessionType: "Individual",
        format: "In-Person",
        status: "Confirmed",
        diagnosis: "Post-Traumatic Stress Disorder",
        notes: "EMDR processing session, target memory from last week",
        sessionNumber: 22,
        duration: 60,
        rate: 130,
      },
    },
    {
      id: "6",
      title: "Group Therapy - Anxiety Support",
      start: new Date(2024, 11, 25, 18, 0),
      end: new Date(2024, 11, 25, 19, 30),
      resource: {
        clientId: "group1",
        clientName: "Anxiety Support Group",
        clientEmail: "group@therapease.com",
        sessionType: "Group",
        format: "In-Person",
        status: "Confirmed",
        diagnosis: "Various Anxiety Disorders",
        notes: "Weekly group session, 6 participants",
        sessionNumber: 12,
        duration: 90,
        rate: 60,
      },
    },
  ];

  // Initialize events data
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setEvents(mockEvents);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load calendar events.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [toast]);

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const resource = event.resource;

      if (
        filters.sessionType !== "all" &&
        resource.sessionType !== filters.sessionType
      ) {
        return false;
      }
      if (filters.format !== "all" && resource.format !== filters.format) {
        return false;
      }
      if (filters.status !== "all" && resource.status !== filters.status) {
        return false;
      }
      if (
        filters.client !== "all" &&
        !resource.clientName
          .toLowerCase()
          .includes(filters.client.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [events, filters]);

  // Event style function
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const resource = event.resource;
    let backgroundColor = "#0086b3";
    let borderColor = "#0086b3";

    // Color by session type
    switch (resource.sessionType) {
      case "Individual":
        backgroundColor = "#0086b3";
        borderColor = "#0086b3";
        break;
      case "Couples":
        backgroundColor = "#7c3aed";
        borderColor = "#7c3aed";
        break;
      case "Family":
        backgroundColor = "#059669";
        borderColor = "#059669";
        break;
      case "Group":
        backgroundColor = "#dc2626";
        borderColor = "#dc2626";
        break;
    }

    // Adjust opacity based on status
    if (resource.status === "Pending") {
      backgroundColor = backgroundColor + "80"; // 50% opacity
    } else if (
      resource.status === "Cancelled" ||
      resource.status === "No-Show"
    ) {
      backgroundColor = "#6b7280";
      borderColor = "#6b7280";
    } else if (resource.status === "Completed") {
      backgroundColor = "#10b981";
      borderColor = "#10b981";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "12px",
        padding: "2px 6px",
      },
    };
  }, []);

  // Handle event selection
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventDetailModalOpen(true);
  }, []);

  // Handle slot selection for new appointments
  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      // Only allow selection of future slots
      if (start < new Date()) {
        toast({
          title: "Invalid Time",
          description: "Cannot schedule appointments in the past.",
          variant: "destructive",
        });
        return;
      }

      setScheduleModalOpen(true);
    },
    [toast],
  );

  // Handle event move (drag and drop)
  const handleEventDrop = useCallback(
    ({
      event,
      start,
      end,
    }: {
      event: CalendarEvent;
      start: Date;
      end: Date;
    }) => {
      if (start < new Date()) {
        toast({
          title: "Invalid Move",
          description: "Cannot move appointments to the past.",
          variant: "destructive",
        });
        return;
      }

      showModal({
        type: "info",
        title: "Reschedule Appointment",
        message: `Are you sure you want to reschedule ${event.resource.clientName}'s appointment to ${moment(start).format("MMMM Do, YYYY [at] h:mm A")}?`,
        confirmLabel: "Reschedule",
        cancelLabel: "Cancel",
        showCancel: true,
        onConfirm: () => {
          setEvents((prev) =>
            prev.map((e) => (e.id === event.id ? { ...e, start, end } : e)),
          );
          toast({
            title: "Appointment Rescheduled",
            description: `${event.resource.clientName}'s appointment has been rescheduled.`,
          });
        },
      });
    },
    [showModal, toast],
  );

  // Handle event actions
  const handleEventAction = useCallback(
    (action: string, event: CalendarEvent) => {
      switch (action) {
        case "edit":
          // Open edit modal
          setSelectedEvent(event);
          setScheduleModalOpen(true);
          break;

        case "complete":
          showModal({
            type: "success",
            title: "Mark as Completed",
            message: `Mark ${event.resource.clientName}'s session as completed?`,
            confirmLabel: "Complete",
            cancelLabel: "Cancel",
            showCancel: true,
            onConfirm: () => {
              setEvents((prev) =>
                prev.map((e) =>
                  e.id === event.id
                    ? {
                        ...e,
                        resource: { ...e.resource, status: "Completed" },
                      }
                    : e,
                ),
              );
              toast({
                title: "Session Completed",
                description: `${event.resource.clientName}'s session marked as completed.`,
              });
            },
          });
          break;

        case "cancel":
          showModal({
            type: "destructive",
            title: "Cancel Appointment",
            message: `Are you sure you want to cancel ${event.resource.clientName}'s appointment?`,
            confirmLabel: "Cancel Appointment",
            cancelLabel: "Keep Appointment",
            showCancel: true,
            onConfirm: () => {
              setEvents((prev) =>
                prev.map((e) =>
                  e.id === event.id
                    ? {
                        ...e,
                        resource: { ...e.resource, status: "Cancelled" },
                      }
                    : e,
                ),
              );
              toast({
                title: "Appointment Cancelled",
                description: `${event.resource.clientName}'s appointment has been cancelled.`,
                variant: "destructive",
              });
            },
          });
          break;

        case "delete":
          showModal({
            type: "destructive",
            title: "Delete Appointment",
            message: `Are you sure you want to permanently delete ${event.resource.clientName}'s appointment? This action cannot be undone.`,
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
            showCancel: true,
            onConfirm: () => {
              setEvents((prev) => prev.filter((e) => e.id !== event.id));
              toast({
                title: "Appointment Deleted",
                description: `${event.resource.clientName}'s appointment has been deleted.`,
              });
            },
          });
          break;

        case "duplicate":
          const newEvent: CalendarEvent = {
            ...event,
            id: `${event.id}-copy-${Date.now()}`,
            title: `${event.title} (Copy)`,
            start: moment(event.start).add(1, "week").toDate(),
            end: moment(event.end).add(1, "week").toDate(),
            resource: {
              ...event.resource,
              status: "Pending",
            },
          };
          setEvents((prev) => [...prev, newEvent]);
          toast({
            title: "Appointment Duplicated",
            description: `Created a copy of ${event.resource.clientName}'s appointment for next week.`,
          });
          break;
      }
    },
    [showModal, toast],
  );

  // Export calendar data
  const handleExportCalendar = useCallback(() => {
    try {
      const csvHeaders = [
        "Date",
        "Time",
        "Client Name",
        "Session Type",
        "Format",
        "Status",
        "Duration (min)",
        "Rate",
        "Diagnosis",
        "Notes",
      ];

      const csvData = filteredEvents.map((event) => [
        moment(event.start).format("YYYY-MM-DD"),
        moment(event.start).format("HH:mm") +
          " - " +
          moment(event.end).format("HH:mm"),
        event.resource.clientName,
        event.resource.sessionType,
        event.resource.format,
        event.resource.status,
        event.resource.duration.toString(),
        `$${event.resource.rate}`,
        event.resource.diagnosis,
        `"${(event.resource.notes || "").replace(/"/g, '""')}"`,
      ]);

      const csvContent = [csvHeaders, ...csvData]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `calendar-${currentView}-${moment(currentDate).format("YYYY-MM")}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Calendar Exported",
        description: `${filteredEvents.length} appointments exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the calendar.",
        variant: "destructive",
      });
    }
  }, [filteredEvents, currentView, currentDate, toast]);

  // Custom toolbar
  const CustomToolbar = ({ date, view, onNavigate, onView }: any) => {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("PREV")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("TODAY")}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("NEXT")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="ml-4 text-lg font-semibold">
            {moment(date).format("MMMM YYYY")}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => onView("month")}
          >
            Month
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => onView("week")}
          >
            Week
          </Button>
          <Button
            variant={view === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => onView("day")}
          >
            Day
          </Button>
        </div>
      </div>
    );
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Confirmed":
        return { icon: CheckCircle, color: "text-green-600" };
      case "Pending":
        return { icon: Clock, color: "text-yellow-600" };
      case "Completed":
        return { icon: CheckCircle, color: "text-blue-600" };
      case "Cancelled":
        return { icon: XCircle, color: "text-red-600" };
      case "No-Show":
        return { icon: AlertCircle, color: "text-orange-600" };
      default:
        return { icon: Clock, color: "text-gray-600" };
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "In-Person":
        return MapPin;
      case "Telehealth":
        return Video;
      case "Phone":
        return Phone;
      default:
        return MapPin;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading calendar...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-8 w-8" />
              Calendar
            </h1>
            <p className="text-muted-foreground">
              Manage your appointment schedule and sessions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportCalendar}
              disabled={filteredEvents.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export ({filteredEvents.length})
            </Button>
            <Button onClick={() => setScheduleModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Calendar Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="session-type">Session Type</Label>
                <Select
                  value={filters.sessionType}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, sessionType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Couples">Couples</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Group">Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="format">Format</Label>
                <Select
                  value={filters.format}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Formats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                    <SelectItem value="Telehealth">Telehealth</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="No-Show">No-Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="client">Client Search</Label>
                <Input
                  placeholder="Search clients..."
                  value={filters.client === "all" ? "" : filters.client}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      client: e.target.value || "all",
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardContent className="p-6">
            <div style={{ height: 600 }}>
              <BigCalendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                view={currentView}
                onView={setCurrentView}
                date={currentDate}
                onNavigate={setCurrentDate}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                onEventDrop={handleEventDrop}
                eventPropGetter={eventStyleGetter}
                selectable
                resizable
                dragFromOutsideItem={false}
                components={{
                  toolbar: CustomToolbar,
                }}
                step={15}
                timeslots={4}
                min={new Date(2024, 0, 1, 7, 0)} // 7:00 AM
                max={new Date(2024, 0, 1, 20, 0)} // 8:00 PM
                formats={{
                  timeGutterFormat: "h:mm A",
                  eventTimeRangeFormat: ({ start, end }) =>
                    `${moment(start).format("h:mm A")} - ${moment(end).format("h:mm A")}`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Session Type Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-sm">Individual Therapy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                <span className="text-sm">Couples Therapy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span className="text-sm">Family Therapy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span className="text-sm">Group Therapy</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Detail Modal */}
        <Dialog
          open={eventDetailModalOpen}
          onOpenChange={setEventDetailModalOpen}
        >
          <DialogContent className="max-w-2xl">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {selectedEvent.resource.clientName}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Session Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Date & Time</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {moment(selectedEvent.start).format("MMMM Do, YYYY")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {moment(selectedEvent.start).format("h:mm A")} -{" "}
                          {moment(selectedEvent.end).format("h:mm A")}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">
                        Session Details
                      </Label>
                      <div className="space-y-2 mt-1">
                        <Badge variant="outline">
                          {selectedEvent.resource.sessionType} Therapy
                        </Badge>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const FormatIcon = getFormatIcon(
                              selectedEvent.resource.format,
                            );
                            return (
                              <FormatIcon className="h-4 w-4 text-muted-foreground" />
                            );
                          })()}
                          <span className="text-sm">
                            {selectedEvent.resource.format}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const { icon: StatusIcon, color } = getStatusInfo(
                              selectedEvent.resource.status,
                            );
                            return (
                              <StatusIcon className={`h-4 w-4 ${color}`} />
                            );
                          })()}
                          <span className="text-sm">
                            {selectedEvent.resource.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Diagnosis</Label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedEvent.resource.diagnosis}
                    </p>
                  </div>

                  {selectedEvent.resource.notes && (
                    <div>
                      <Label className="text-sm font-medium">
                        Session Notes
                      </Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedEvent.resource.notes}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Session #</Label>
                      <p className="mt-1 text-sm">
                        {selectedEvent.resource.sessionNumber}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Duration</Label>
                      <p className="mt-1 text-sm">
                        {selectedEvent.resource.duration} minutes
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Rate</Label>
                      <p className="mt-1 text-sm">
                        ${selectedEvent.resource.rate}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEventAction("edit", selectedEvent)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleEventAction("duplicate", selectedEvent)
                      }
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </Button>
                    {selectedEvent.resource.status === "Confirmed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleEventAction("complete", selectedEvent)
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEventAction("cancel", selectedEvent)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleEventAction("delete", selectedEvent)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Schedule Session Modal */}
        <ScheduleSessionModal
          open={scheduleModalOpen}
          onOpenChange={setScheduleModalOpen}
        />

        <ModalComponent />
      </div>
    </Layout>
  );
};

export default Calendar;
