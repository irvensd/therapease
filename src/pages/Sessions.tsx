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
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          role="banner"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Session Management
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Schedule, track, and manage your therapy sessions
            </p>
          </div>
          <Button
            onClick={() => setScheduleModalOpen(true)}
            className="shrink-0"
            aria-label="Schedule new session"
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Schedule Session
          </Button>
        </div>

        {/* Stats Cards */}
        <div
          className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4"
          role="region"
          aria-label="Session statistics"
        >
          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-xl sm:text-2xl font-bold"
                aria-label={`${sessionStats.totalSessions} total sessions`}
              >
                {sessionStats.totalSessions}
              </div>
              <p className="text-xs text-muted-foreground">
                {sessionStats.totalHours}h total
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle
                  className="h-4 w-4 text-green-600"
                  aria-hidden="true"
                />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-xl sm:text-2xl font-bold"
                aria-label={`${sessionStats.completedSessions} completed sessions`}
              >
                {sessionStats.completedSessions}
              </div>
              <p className="text-xs text-muted-foreground">
                {sessionStats.completionRate}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" aria-hidden="true" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-xl sm:text-2xl font-bold"
                aria-label={`${sessionStats.upcomingSessions} upcoming sessions`}
              >
                {sessionStats.upcomingSessions}
              </div>
              <p className="text-xs text-muted-foreground">this week</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp
                  className="h-4 w-4 text-purple-600"
                  aria-hidden="true"
                />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {sessionStats.completionRate}%
              </div>
              <Progress
                value={sessionStats.completionRate}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                View and manage your sessions in a calendar format with
                drag-and-drop scheduling
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCalendarModalOpen(true)}
                aria-label="Open calendar view"
              >
                <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                Open Calendar
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                Time Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Track session duration, billing time, and productivity analytics
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewReports}
                aria-label="View time tracking reports"
              >
                <TrendingUp className="mr-2 h-4 w-4" aria-hidden="true" />
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                Session Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Create reusable session formats and standardized note templates
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSessionTemplates}
                aria-label="Manage session templates"
              >
                <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                Manage Templates
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Session List */}
        <Card className="therapease-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Recent Sessions</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No-Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">
                        Client & Date
                      </TableHead>
                      <TableHead className="min-w-[120px] hidden sm:table-cell">
                        Time & Duration
                      </TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[100px] hidden md:table-cell">
                        Type & Format
                      </TableHead>
                      <TableHead className="min-w-[150px] hidden lg:table-cell">
                        Location/Notes
                      </TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.map((session) => (
                      <TableRow
                        key={session.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {session.clientName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(session.date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {session.diagnosis}
                            </div>
                            {/* Mobile-only time info */}
                            <div className="sm:hidden mt-1 text-xs text-muted-foreground">
                              {session.time} • {session.duration}min
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="text-sm">
                            <div className="font-medium">{session.time}</div>
                            <div className="text-muted-foreground">
                              {session.duration} minutes
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(session.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(session.status)}
                              {session.status}
                            </span>
                          </Badge>
                          {/* Mobile-only type info */}
                          <div className="md:hidden mt-1 text-xs text-muted-foreground">
                            {session.type} • {session.format}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">
                            <div className="font-medium">{session.type}</div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              {getFormatIcon(session.format)}
                              {session.format}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-sm">
                            {session.location && (
                              <div className="font-medium">
                                {session.location}
                              </div>
                            )}
                            {session.notes && (
                              <div className="text-muted-foreground truncate max-w-[120px]">
                                {session.notes}
                              </div>
                            )}
                            {!session.location && !session.notes && (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleSessionAction(session, "view")
                              }
                              aria-label={`View details for ${session.clientName}'s session`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {session.status === "Scheduled" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleSessionAction(session, "complete")
                                  }
                                  aria-label={`Mark ${session.clientName}'s session as completed`}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleSessionAction(session, "cancel")
                                  }
                                  aria-label={`Cancel ${session.clientName}'s session`}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {filteredSessions.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-medium">
                  No sessions found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {statusFilter !== "all"
                    ? "Try changing the status filter to see more sessions"
                    : "Schedule your first session to get started"}
                </p>
                {statusFilter === "all" && (
                  <Button
                    className="mt-4"
                    onClick={() => setScheduleModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule First Session
                  </Button>
                )}
              </div>
            )}
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
      <ModalComponent />
    </Layout>
  );
};

export default Sessions;
