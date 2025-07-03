import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Plus,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Loader2,
  FileText,
  Phone,
  Video,
  MapPin,
} from "lucide-react";
import { ScheduleSessionModal } from "@/components/modals/ScheduleSessionModal";
import { SessionCalendarModal } from "@/components/modals/SessionCalendarModal";

// Types for better type safety
interface Session {
  id: number;
  clientName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: "Individual" | "Couples" | "Family" | "Group";
  format: "In-Person" | "Video Call" | "Phone Call";
  status: "Scheduled" | "Completed" | "Cancelled" | "No-Show";
  location?: string;
  notes?: string;
  diagnosis: string;
}

interface SessionStats {
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  completionRate: number;
  totalHours: number;
}

const Sessions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showModal, ModalComponent } = useConfirmationModal();

  // State management
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock session data - in real app would be fetched from API
  const mockSessions: Session[] = [
    {
      id: 1,
      clientName: "Emma Thompson",
      date: "2024-01-22",
      time: "09:00",
      duration: 50,
      type: "Individual",
      format: "In-Person",
      status: "Scheduled",
      location: "Office Room A",
      diagnosis: "Anxiety Disorder",
    },
    {
      id: 2,
      clientName: "Michael Chen",
      date: "2024-01-22",
      time: "10:30",
      duration: 60,
      type: "Couples",
      format: "Video Call",
      status: "Scheduled",
      diagnosis: "Relationship Issues",
    },
    {
      id: 3,
      clientName: "Sarah Johnson",
      date: "2024-01-20",
      time: "14:00",
      duration: 50,
      type: "Individual",
      format: "In-Person",
      status: "Completed",
      location: "Office Room B",
      notes: "Made progress on coping strategies",
      diagnosis: "PTSD",
    },
    {
      id: 4,
      clientName: "David Wilson",
      date: "2024-01-19",
      time: "16:00",
      duration: 75,
      type: "Family",
      format: "In-Person",
      status: "Completed",
      location: "Conference Room",
      diagnosis: "Family Therapy",
    },
    {
      id: 5,
      clientName: "Lisa Rodriguez",
      date: "2024-01-18",
      time: "11:00",
      duration: 50,
      type: "Individual",
      format: "Phone Call",
      status: "No-Show",
      diagnosis: "Depression",
    },
    {
      id: 6,
      clientName: "Robert Kim",
      date: "2024-01-17",
      time: "13:30",
      duration: 50,
      type: "Individual",
      format: "Video Call",
      status: "Cancelled",
      diagnosis: "Anxiety",
    },
  ];

  // Load sessions data on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSessions(mockSessions);
      } catch (err) {
        setError("Failed to load session data. Please try again.");
        toast({
          variant: "destructive",
          title: "Error Loading Sessions",
          description: "There was a problem loading session data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, [toast]);

  // Computed values
  const filteredSessions = sessions.filter((session) => {
    if (statusFilter === "all") return true;
    return session.status.toLowerCase() === statusFilter;
  });

  const sessionStats: SessionStats = {
    totalSessions: sessions.length,
    completedSessions: sessions.filter((s) => s.status === "Completed").length,
    upcomingSessions: sessions.filter((s) => s.status === "Scheduled").length,
    completionRate:
      sessions.length > 0
        ? Math.round(
            (sessions.filter((s) => s.status === "Completed").length /
              sessions.length) *
              100,
          )
        : 0,
    totalHours:
      Math.round((sessions.reduce((sum, s) => sum + s.duration, 0) / 60) * 10) /
      10,
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "No-Show":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Clock className="h-3 w-3" />;
      case "Completed":
        return <CheckCircle className="h-3 w-3" />;
      case "Cancelled":
        return <XCircle className="h-3 w-3" />;
      case "No-Show":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "Video Call":
        return <Video className="h-3 w-3" />;
      case "Phone Call":
        return <Phone className="h-3 w-3" />;
      case "In-Person":
        return <MapPin className="h-3 w-3" />;
      default:
        return <MapPin className="h-3 w-3" />;
    }
  };

  // Action handlers with proper error handling
  const handleNavigation = useCallback(
    (path: string, actionName: string) => {
      try {
        navigate(path);
        toast({
          title: "Navigation",
          description: `Navigating to ${actionName}...`,
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Navigation Error",
          description: "Failed to navigate. Please try again.",
        });
      }
    },
    [navigate, toast],
  );

  const handleViewReports = useCallback(() => {
    showModal({
      type: "info",
      title: "Time Tracking Reports",
      message:
        "Time tracking reports will show detailed analytics including session duration summaries, billing time analysis, productivity metrics, and client engagement patterns. This feature provides valuable insights for practice management and billing optimization.",
      confirmLabel: "Got it",
      onConfirm: () => {
        toast({
          title: "Feature Coming Soon",
          description:
            "Time tracking reports will be available in the next update.",
        });
      },
    });
  }, [showModal, toast]);

  const handleSessionTemplates = useCallback(() => {
    showModal({
      type: "info",
      title: "Session Templates",
      message:
        "Session templates will allow you to create reusable session formats, pre-defined note structures, treatment plan templates, and standardized assessment forms. This will streamline your workflow and ensure consistency across sessions.",
      confirmLabel: "Sounds great",
      onConfirm: () => {
        toast({
          title: "Feature In Development",
          description:
            "Session templates are being developed and will be available soon.",
        });
      },
    });
  }, [showModal, toast]);

  const handleSessionAction = useCallback(
    (session: Session, action: string) => {
      switch (action) {
        case "view":
          showModal({
            type: "info",
            title: `Session Details - ${session.clientName}`,
            message: `Date: ${new Date(session.date).toLocaleDateString()}\nTime: ${session.time}\nDuration: ${session.duration} minutes\nType: ${session.type}\nFormat: ${session.format}\nStatus: ${session.status}\n${session.notes ? `Notes: ${session.notes}` : ""}`,
            confirmLabel: "Close",
          });
          break;
        case "edit":
          toast({
            title: "Edit Session",
            description: `Edit functionality for ${session.clientName}'s session would be implemented here.`,
          });
          break;
        case "complete":
          setSessions((prev) =>
            prev.map((s) =>
              s.id === session.id ? { ...s, status: "Completed" as const } : s,
            ),
          );
          toast({
            title: "Session Completed",
            description: `Marked ${session.clientName}'s session as completed.`,
          });
          break;
        case "cancel":
          setSessions((prev) =>
            prev.map((s) =>
              s.id === session.id ? { ...s, status: "Cancelled" as const } : s,
            ),
          );
          toast({
            title: "Session Cancelled",
            description: `Cancelled ${session.clientName}'s session.`,
          });
          break;
      }
    },
    [showModal, toast],
  );

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading sessions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
            <p className="text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Session Management</h1>
            <p className="text-muted-foreground">
              Schedule, track, and manage your therapy sessions
            </p>
          </div>
          <Button onClick={() => setScheduleModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Session
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View and manage your sessions in a calendar format
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCalendarModalOpen(true)}
              >
                Open Calendar
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Time Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Track session duration and billing time
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  alert(
                    "Time tracking reports coming soon! This will show session duration analytics and billing time summaries.",
                  );
                }}
              >
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setScheduleModalOpen(true)}
              >
                Schedule New Session
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/")}
              >
                View Today's Sessions
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  alert(
                    "Session templates coming soon! This will allow you to create reusable session formats and notes templates.",
                  );
                }}
              >
                Session Templates
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="therapease-card">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The session management system is currently being developed. This
              will include calendar integration, automated reminders, session
              notes linking, and comprehensive reporting features.
            </p>
          </CardContent>
        </Card>
      </div>

      <ScheduleSessionModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
      />
      <SessionCalendarModal
        open={calendarModalOpen}
        onOpenChange={setCalendarModalOpen}
      />
    </Layout>
  );
};

export default Sessions;
