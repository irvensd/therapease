import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
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
} from "lucide-react";
import Layout from "@/components/Layout";
import { NewClientModal } from "@/components/modals/NewClientModal";
import { AddReminderModal } from "@/components/modals/AddReminderModal";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock user data - in real app would come from auth context
  const userName = "Dr. Wilson";

  // Mock dashboard data - in real app would be fetched from API
  const [dashboardData] = useState({
    stats: {
      activeClients: 48,
      weeklySessionsScheduled: 28,
      monthlyRevenue: 12450,
      completionRate: 94,
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
      <div className="p-6 space-y-6">
        {/* Welcome section */}
        <div className="therapease-gradient rounded-xl p-6" role="banner">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Here's what's happening in your practice today
          </p>
        </div>

        {/* Quick stats */}
        <div
          className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4"
          role="region"
          aria-label="Practice overview statistics"
        >
          <Card className="therapease-card">
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
                className="text-xl sm:text-2xl font-bold"
                aria-label={`${dashboardData.stats.activeClients} active clients`}
              >
                {dashboardData.stats.activeClients}
              </div>
              <p className="text-xs text-muted-foreground">
                +3 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div
                className="text-xl sm:text-2xl font-bold"
                aria-label={`${dashboardData.stats.weeklySessionsScheduled} sessions this week`}
              >
                {dashboardData.stats.weeklySessionsScheduled}
              </div>
              <p className="text-xs text-muted-foreground">
                sessions scheduled
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSign
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div
                className="text-xl sm:text-2xl font-bold"
                aria-label={`$${dashboardData.stats.monthlyRevenue.toLocaleString()} monthly revenue`}
              >
                ${dashboardData.stats.monthlyRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
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
                className="text-xl sm:text-2xl font-bold"
                aria-label={`${dashboardData.stats.completionRate}% session completion rate`}
              >
                {dashboardData.stats.completionRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                session attendance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Improved styling */}
        <div
          className="bg-gradient-to-r from-primary/5 via-background to-accent/5 rounded-xl p-4 sm:p-6 border border-border"
          role="region"
          aria-label="Quick actions"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">
                Quick Actions
              </h2>
              <p className="text-sm text-muted-foreground">
                Common tasks to streamline your workflow
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary w-fit"
            >
              <Zap className="h-3 w-3 mr-1" aria-hidden="true" />
              Fast workflow
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              onClick={handleNewClientModalOpen}
              variant="outline"
              className="h-14 sm:h-16 flex-col gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 transition-colors"
              aria-label="Add new client"
            >
              <Users className="h-4 sm:h-5 w-4 sm:w-5" aria-hidden="true" />
              <span className="text-xs font-medium">Add Client</span>
            </Button>

            <Button
              onClick={() => handleNavigation("/sessions", "Sessions")}
              variant="outline"
              className="h-14 sm:h-16 flex-col gap-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800 transition-colors"
              aria-label="Schedule new session"
            >
              <Calendar className="h-4 sm:h-5 w-4 sm:w-5" aria-hidden="true" />
              <span className="text-xs font-medium">Schedule Session</span>
            </Button>

            <Button
              onClick={() => handleNavigation("/notes", "Notes")}
              variant="outline"
              className="h-14 sm:h-16 flex-col gap-2 bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 hover:text-purple-800 transition-colors"
              aria-label="Create session note"
            >
              <FileText className="h-4 sm:h-5 w-4 sm:w-5" aria-hidden="true" />
              <span className="text-xs font-medium">Create Note</span>
            </Button>

            <Button
              onClick={() => handleNavigation("/invoices", "Invoices")}
              variant="outline"
              className="h-14 sm:h-16 flex-col gap-2 bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700 hover:text-orange-800 transition-colors"
              aria-label="Create new invoice"
            >
              <DollarSign
                className="h-4 sm:h-5 w-4 sm:w-5"
                aria-hidden="true"
              />
              <span className="text-xs font-medium">Create Invoice</span>
            </Button>
          </div>
        </div>

        {/* Today's schedule and reminders */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Today's Sessions */}
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>Today's Sessions</span>
                <Badge variant="secondary" className="w-fit">
                  {dashboardData.todaySessions.length} scheduled
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.todaySessions.length > 0 ? (
                dashboardData.todaySessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    role="listitem"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-primary/10 flex-shrink-0">
                        <Clock
                          className="h-3 sm:h-4 w-3 sm:w-4 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">
                          {session.client}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {session.time} • {session.type}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        session.status === "confirmed" ? "default" : "secondary"
                      }
                      className="capitalize text-xs flex-shrink-0"
                    >
                      {session.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No sessions scheduled for today</p>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleNavigation("/sessions", "Sessions")}
                aria-label="View full schedule"
              >
                <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                View Full Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Active Reminders */}
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>Active Reminders</span>
                <Badge variant="destructive" className="w-fit">
                  {
                    dashboardData.reminders.filter((r) => r.priority === "high")
                      .length
                  }{" "}
                  urgent
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.reminders.length > 0 ? (
                dashboardData.reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    role="listitem"
                  >
                    <div
                      className={`flex items-center justify-center w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        reminder.priority === "high"
                          ? "bg-destructive"
                          : reminder.priority === "medium"
                            ? "bg-accent"
                            : "bg-muted-foreground"
                      }`}
                      aria-label={`${reminder.priority} priority`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">
                        {reminder.title}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {reminder.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {reminder.time}
                      </p>
                    </div>
                    <AlertCircle
                      className="h-4 w-4 text-muted-foreground flex-shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No active reminders</p>
                </div>
              )}
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
        </div>

        {/* Wellness Monitor and Progress Overview */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TherapistWellness mode="dashboard" />
          <ProgressChart mode="dashboard" />
        </div>

        {/* Clinical Assessments and Weekly Progress */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Clinical Assessments */}
          <ClinicalAssessments mode="dashboard" />

          {/* Weekly Progress */}
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Sessions Completed</span>
                  <span>18/25 (72%)</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Notes Documented</span>
                  <span>16/18 (89%)</span>
                </div>
                <Progress value={89} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Invoices Sent</span>
                  <span>12/18 (67%)</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Great week! You're ahead of schedule on documentation and just
                  need to catch up on invoicing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <NewClientModal
        open={newClientModalOpen}
        onOpenChange={handleNewClientModalClose}
      />
      <AddReminderModal
        open={addReminderModalOpen}
        onOpenChange={handleAddReminderModalClose}
      />
    </Layout>
  );
};

export default Dashboard;
