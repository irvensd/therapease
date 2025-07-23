import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Zap,
  FileText,
  Loader2,
  CheckCircle,
  User,
  Phone,
  Mail,
  Activity,
  Target,
  Settings,
  Heart,
} from "lucide-react";
import Layout from "@/components/Layout";
import { NewClientModal } from "@/components/modals/NewClientModal";
import { AddReminderModal } from "@/components/modals/AddReminderModal";
import { ScheduleSessionModal } from "@/components/modals/ScheduleSessionModal";
import { NewNoteModal } from "@/components/modals/NewNoteModal";
import { SessionWorkspaceModal } from "@/components/modals/SessionWorkspaceModal";
import { SessionPrepModal } from "@/components/modals/SessionPrepModal";
import { AIAssistant } from "@/components/AIAssistant";
import { ProgressChart } from "@/components/ProgressChart";
import { TherapistWellness } from "@/components/TherapistWellness";
import { QuickActions } from "@/components/QuickActions";
import { ClinicalAssessments } from "@/components/ClinicalAssessments";

// Types for better type safety
interface DashboardStats {
  activeClients: number;
  weeklySessionsScheduled: number;
  monthlyRevenue: number;
  completionRate: number;
}

interface TodaySession {
  id: string;
  time: string;
  client: string;
  type: string;
  status: "confirmed" | "pending";
}

interface ActiveReminder {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  time: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [addReminderModalOpen, setAddReminderModalOpen] = useState(false);
  const [scheduleSessionModalOpen, setScheduleSessionModalOpen] =
    useState(false);
  const [newNoteModalOpen, setNewNoteModalOpen] = useState(false);
  const [sessionWorkspaceModalOpen, setSessionWorkspaceModalOpen] =
    useState(false);
  const [sessionPrepModalOpen, setSessionPrepModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock user data - in real app would come from auth context
  const userName = "Dr. Wilson";

  // Check if this is a new user (for demo purposes, check if they've seen the dashboard before)
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const hasVisitedDashboard = localStorage.getItem("therapease_dashboard_visited");
    if (!hasVisitedDashboard) {
      setIsNewUser(true);
      localStorage.setItem("therapease_dashboard_visited", "true");
    }
  }, []);

  // Mock dashboard data - in real app would be fetched from API
  const [dashboardData] = useState({
    stats: {
      activeClients: isNewUser ? 0 : 48,
      weeklySessionsScheduled: isNewUser ? 0 : 28,
      monthlyRevenue: isNewUser ? 0 : 12450,
      completionRate: isNewUser ? 0 : 94,
    } as DashboardStats,
    todaySessions: [
      {
        id: "1",
        time: "9:00 AM",
        client: "Emma Thompson",
        type: "Individual Therapy",
        status: "confirmed" as const,
      },
      {
        id: "2",
        time: "10:30 AM",
        client: "Michael Chen",
        type: "Couples Therapy",
        status: "confirmed" as const,
      },
      {
        id: "3",
        time: "2:00 PM",
        client: "Sarah Johnson",
        type: "Individual Therapy",
        status: "pending" as const,
      },
      {
        id: "4",
        time: "3:30 PM",
        client: "David Wilson",
        type: "Family Therapy",
        status: "confirmed" as const,
      },
    ] as TodaySession[],
    reminders: [
      {
        id: "1",
        title: "Follow up with Emma Thompson",
        description: "Session notes completion overdue",
        priority: "high" as const,
        time: "2 hours ago",
      },
      {
        id: "2",
        title: "Insurance authorization",
        description: "Michael Chen - renewal needed",
        priority: "high" as const,
        time: "1 day ago",
      },
      {
        id: "3",
        title: "Treatment plan review",
        description: "Sarah Johnson - quarterly review",
        priority: "medium" as const,
        time: "3 days ago",
      },
      {
        id: "4",
        title: "Appointment confirmation",
        description: "David Wilson - next week",
        priority: "low" as const,
        time: "5 days ago",
      },
    ] as ActiveReminder[],
  });

  // Simulate loading data on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data. Please refresh the page.");
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Improved navigation with error handling
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

  // Modal handlers with toast feedback
  const handleNewClientModalOpen = useCallback(() => {
    setNewClientModalOpen(true);
  }, []);

  const handleNewClientModalClose = useCallback(() => {
    setNewClientModalOpen(false);
  }, []);

  const handleAddReminderModalOpen = useCallback(() => {
    setAddReminderModalOpen(true);
  }, []);

  const handleAddReminderModalClose = useCallback(() => {
    setAddReminderModalOpen(false);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
      <div className="therapease-page-container therapease-section-spacing">
        {/* Welcome section */}
        <div
          className="therapease-gradient rounded-xl p-4 sm:p-6"
          role="banner"
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Here's what's happening in your practice today
          </p>
        </div>

        {/* Empty State for New Users */}
        {isNewUser && (
          <Card className="border-dashed border-2 border-muted-foreground/25">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                  Welcome to TherapEase!
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Let's get your practice set up. Start by adding your first client,
                  scheduling sessions, or exploring the platform features.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleNavigation("/clients", "add first client")}>
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Add Your First Client</h4>
                    <p className="text-sm text-muted-foreground">Create client profiles and intake forms</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleNavigation("/calendar", "schedule first session")}>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Schedule Sessions</h4>
                    <p className="text-sm text-muted-foreground">Set up your calendar and appointments</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleNavigation("/settings", "configure practice")}>
                  <CardContent className="p-4 text-center">
                    <Settings className="h-6 w-6 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Configure Practice</h4>
                    <p className="text-sm text-muted-foreground">Set up your practice information</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick stats */}
        <div
          className="grid therapease-grid-spacing grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          role="region"
          aria-label="Practice overview statistics"
        >
          <Card
            className="therapease-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleNavigation("/clients", "client management")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Clients
              </CardTitle>
              <Users
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div
                className="text-lg sm:text-xl lg:text-2xl font-bold"
                aria-label={`${dashboardData.stats.activeClients} active clients`}
              >
                {dashboardData.stats.activeClients}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                +3 from last month
              </p>
            </CardContent>
          </Card>

          <Card
            className="therapease-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleNavigation("/sessions", "session management")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div
                className="text-lg sm:text-xl lg:text-2xl font-bold"
                aria-label={`${dashboardData.stats.weeklySessionsScheduled} sessions this week`}
              >
                {dashboardData.stats.weeklySessionsScheduled}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                sessions scheduled
              </p>
            </CardContent>
          </Card>

          <Card
            className="therapease-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() =>
              handleNavigation("/invoices", "billing and invoices")
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div
                className="text-lg sm:text-xl lg:text-2xl font-bold"
                aria-label={`$${dashboardData.stats.monthlyRevenue.toLocaleString()} monthly revenue`}
              >
                ${dashboardData.stats.monthlyRevenue.toLocaleString()}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                this month
              </p>
            </CardContent>
          </Card>

          <Card
            className="therapease-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() =>
              handleNavigation("/reports", "reports and analytics")
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <TrendingUp
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div
                className="text-lg sm:text-xl lg:text-2xl font-bold"
                aria-label={`${dashboardData.stats.completionRate}% completion rate`}
              >
                {dashboardData.stats.completionRate}%
              </div>
              <Progress
                value={dashboardData.stats.completionRate}
                className="mt-2"
                aria-label="Completion rate progress"
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <QuickActions
          onAction={(action, data) => {
            switch (action) {
              case "new-client":
                handleNewClientModalOpen();
                toast({
                  title: "New Client",
                  description: "Opening client registration form...",
                });
                break;
              case "schedule-session":
                setScheduleSessionModalOpen(true);
                toast({
                  title: "Schedule Session",
                  description: "Opening session scheduler...",
                });
                break;
              case "create-note":
                setNewNoteModalOpen(true);
                toast({
                  title: "New Note",
                  description: "Opening note editor...",
                });
                break;
              case "create-invoice":
                handleNavigation("/invoices", "invoice creation");
                break;
              case "send-reminder":
                handleAddReminderModalOpen();
                toast({
                  title: "Add Reminder",
                  description: "Opening reminder form...",
                });
                break;
              case "emergency-contact":
                toast({
                  title: "Emergency Resources",
                  description:
                    "National Suicide Prevention Lifeline: 988 | Crisis Text Line: Text HOME to 741741 | Emergency Services: 911",
                  variant: "destructive",
                });
                break;
              case "backup-data":
                toast({
                  title: "Data Export",
                  description:
                    "Practice data exported successfully! Download will start automatically.",
                });
                break;
              case "quick-search":
                toast({
                  title: "Quick Search",
                  description:
                    "Global search activated! Use the search bar to find anything.",
                });
                break;
              case "video-call":
                toast({
                  title: "Video Call",
                  description: "Opening secure video call platform...",
                });
                break;
              default:
                break;
            }
          }}
        />

        {/* Main content grid */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card className="therapease-card">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" aria-hidden="true" />
                  Today's Schedule
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleNavigation("/sessions", "session management")
                  }
                  aria-label="View all sessions"
                  className="self-start sm:self-auto"
                >
                  <span className="sm:hidden">View All Sessions</span>
                  <span className="hidden sm:inline">View All</span>
                  <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData.todaySessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer gap-2 sm:gap-0"
                    role="listitem"
                    onClick={() => {
                      setSessionWorkspaceModalOpen(true);
                      toast({
                        title: "Session Workspace",
                        description: `Opening workspace for ${session.client}...`,
                      });
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-8 bg-primary rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base">
                          {session.client}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {session.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:text-right">
                      <p className="font-medium text-sm sm:text-base">
                        {session.time}
                      </p>
                      <Badge
                        variant={
                          session.status === "confirmed" ? "default" : "outline"
                        }
                        className="text-xs"
                      >
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setScheduleSessionModalOpen(true)}
                  aria-label="Schedule new session"
                >
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Schedule New Session
                </Button>
              </CardContent>
            </Card>

            {/* Progress Chart */}
            <ProgressChart />

            {/* Clinical Assessments */}
            <ClinicalAssessments />
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Active Reminders */}
            <Card className="therapease-card">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" aria-hidden="true" />
                  Active Reminders
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleNavigation("/reminders", "reminder management")
                  }
                  aria-label="View all reminders"
                  className="self-start sm:self-auto"
                >
                  <span className="sm:hidden">View All Reminders</span>
                  <span className="hidden sm:inline">View All</span>
                  <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData.reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    role="listitem"
                    onClick={() => {
                      handleNavigation("/reminders", "reminder management");
                      toast({
                        title: "Reminder Details",
                        description: `Viewing reminder: ${reminder.title}`,
                      });
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{reminder.title}</h4>
                      <Badge
                        variant={
                          reminder.priority === "high"
                            ? "destructive"
                            : reminder.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {reminder.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {reminder.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {reminder.time}
                    </p>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleAddReminderModalOpen}
                  aria-label="Add new reminder"
                >
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Add Reminder
                </Button>
              </CardContent>
            </Card>

            {/* Therapist Wellness */}
            <TherapistWellness />

            {/* AI Assistant */}
            <AIAssistant />
          </div>
        </div>

        {/* Modals */}
        <NewClientModal
          open={newClientModalOpen}
          onOpenChange={handleNewClientModalClose}
        />
        <AddReminderModal
          open={addReminderModalOpen}
          onOpenChange={handleAddReminderModalClose}
        />
        <ScheduleSessionModal
          open={scheduleSessionModalOpen}
          onOpenChange={setScheduleSessionModalOpen}
        />
        <NewNoteModal
          open={newNoteModalOpen}
          onOpenChange={setNewNoteModalOpen}
        />
        <SessionWorkspaceModal
          open={sessionWorkspaceModalOpen}
          onOpenChange={setSessionWorkspaceModalOpen}
          session={null}
        />
        <SessionPrepModal
          open={sessionPrepModalOpen}
          onOpenChange={setSessionPrepModalOpen}
          session={null}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
