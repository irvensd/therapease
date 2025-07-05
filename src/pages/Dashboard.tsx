import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
<<<<<<< HEAD
import { useToast } from "@/components/ui/use-toast";
=======
import { Separator } from "@/components/ui/separator";
>>>>>>> def5ca9077b761119b655d8c6c6aad4773f76d19
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
<<<<<<< HEAD
  Zap,
  FileText,
  Loader2,
=======
  FileText,
  CheckCircle,
  User,
  Phone,
  Mail,
  Activity,
  Target,
>>>>>>> def5ca9077b761119b655d8c6c6aad4773f76d19
} from "lucide-react";
import Layout from "@/components/Layout";
import { NewClientModal } from "@/components/modals/NewClientModal";
import { AddReminderModal } from "@/components/modals/AddReminderModal";
<<<<<<< HEAD
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
=======
import { ScheduleSessionModal } from "@/components/modals/ScheduleSessionModal";
import { NewNoteModal } from "@/components/modals/NewNoteModal";
import { SessionWorkspaceModal } from "@/components/modals/SessionWorkspaceModal";
import { SessionPrepModal } from "@/components/modals/SessionPrepModal";
>>>>>>> def5ca9077b761119b655d8c6c6aad4773f76d19

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [addReminderModalOpen, setAddReminderModalOpen] = useState(false);
<<<<<<< HEAD
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
=======
  const [scheduleSessionModalOpen, setScheduleSessionModalOpen] = useState(false);
  const [newNoteModalOpen, setNewNoteModalOpen] = useState(false);
  const [sessionWorkspaceModalOpen, setSessionWorkspaceModalOpen] = useState(false);
  const [sessionPrepModalOpen, setSessionPrepModalOpen] = useState(false);

  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Welcome Header with Current Time */}
        <div className="therapease-gradient rounded-2xl p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Good morning, Dr. Wilson
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                Today is {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{currentTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>6 sessions today</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>2 completed</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">94%</p>
              <p className="text-sm text-muted-foreground">This week's attendance</p>
            </div>
          </div>
        </div>

        {/* Today's Priority Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Next Session */}
          <Card className="therapease-card lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Next Session</CardTitle>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Starting in 15 min
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold">Emma Thompson</h3>
                  <p className="text-muted-foreground mb-2">Individual Therapy • 10:30 AM - 11:30 AM</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Session #12</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>Anxiety Management</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Client
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Review Notes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start h-12" 
                onClick={() => setScheduleSessionModalOpen(true)}
              >
                <Calendar className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Schedule Session</div>
                  <div className="text-xs opacity-70">Book new appointment</div>
                </div>
              </Button>
              <Button 
                className="w-full justify-start h-12" 
                variant="outline"
                onClick={() => setNewNoteModalOpen(true)}
              >
                <FileText className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Add Note</div>
                  <div className="text-xs opacity-70">Document session</div>
                </div>    
              </Button>
              <Button 
                className="w-full justify-start h-12" 
                variant="outline"
                onClick={() => setNewClientModalOpen(true)}
              >
                <Plus className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">New Client</div>
                  <div className="text-xs opacity-70">Add to practice</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="therapease-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
>>>>>>> def5ca9077b761119b655d8c6c6aad4773f76d19
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">28</div>
              <p className="text-xs text-muted-foreground">sessions scheduled</p>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Completion</span>
                  <span>25/28</span>
                </div>
                <Progress value={89} className="h-1" />
              </div>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">48</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>6.7% growth</span>
              </div>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">$12,450</div>
              <p className="text-xs text-muted-foreground">this month</p>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+8% vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">7</div>
              <p className="text-xs text-muted-foreground">require attention</p>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-6"
                  onClick={() => navigate("/reminders")}
                >
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule and Priority Tasks */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Full Schedule */}
          <Card className="therapease-card lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Today's Schedule</CardTitle>
                <Badge variant="secondary">6 sessions</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    time: "9:00 AM",
                    client: "Emma Thompson",
                    type: "Individual Therapy",
                    status: "completed",
                    duration: "60 min",
                  },
                  {
                    time: "10:30 AM",
                    client: "Michael Chen",
                    type: "Couples Therapy",
                    status: "next",
                    duration: "90 min",
                  },
                  {
                    time: "1:00 PM",
                    client: "Sarah Johnson",
                    type: "Individual Therapy",
                    status: "upcoming",
                    duration: "60 min",
                  },
                  {
                    time: "2:30 PM",
                    client: "David Wilson",
                    type: "Family Therapy",
                    status: "upcoming",
                    duration: "75 min",
                  },
                  {
                    time: "4:00 PM",
                    client: "Lisa Park",
                    type: "Individual Therapy",
                    status: "upcoming",
                    duration: "60 min",
                  },
                  {
                    time: "5:30 PM",
                    client: "Robert Smith",
                    type: "Consultation",
                    status: "upcoming",
                    duration: "45 min",
                  },
                ].map((session, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-sm ${
                      session.status === "next" 
                        ? "bg-primary/5 border-primary/20" 
                        : session.status === "completed"
                        ? "bg-green-50 border-green-200"
                        : "bg-muted/30 border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        session.status === "completed" ? "bg-green-500" :
                        session.status === "next" ? "bg-primary" : "bg-muted-foreground"
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{session.client}</p>
                          {session.status === "next" && (
                            <Badge variant="outline" className="text-xs">Next</Badge>
                          )}
                          {session.status === "completed" && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Done</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {session.time} • {session.type} • {session.duration}
                        </p>
                      </div>
                    </div>
                                         <div className="flex items-center gap-2">
                       {session.status === "next" && (
                         <Button size="sm" onClick={() => setSessionWorkspaceModalOpen(true)}>
                           <Clock className="mr-1 h-3 w-3" />
                           Start Session
                         </Button>
                       )}
                       {session.status === "completed" && (
                         <Button variant="outline" size="sm">
                           <FileText className="h-4 w-4" />
                         </Button>
                       )}
                       {session.status === "upcoming" && (
                         <Button variant="outline" size="sm" onClick={() => setSessionPrepModalOpen(true)}>
                           <FileText className="mr-1 h-3 w-3" />
                           Prepare
                         </Button>
                       )}
                     </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate("/sessions")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Full Calendar
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => setScheduleSessionModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Priority Tasks & Reminders */}
          <Card className="therapease-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Priority Tasks</CardTitle>
                <Badge variant="destructive">3 urgent</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Complete session notes",
                    client: "Emma Thompson",
                    priority: "high",
                    time: "Due 2 hours ago",
                    type: "documentation"
                  },
                  {
                    title: "Insurance pre-auth",
                    client: "Michael Chen",
                    priority: "high", 
                    time: "Due today",
                    type: "admin"
                  },
                  {
                    title: "Treatment plan review",
                    client: "Sarah Johnson",
                    priority: "medium",
                    time: "Due tomorrow",
                    type: "clinical"
                  },
                  {
                    title: "Follow-up call",
                    client: "David Wilson",
                    priority: "low",
                    time: "Due this week",
                    type: "communication"
                  },
                ].map((task, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.client}</p>
                      <p className="text-xs text-muted-foreground mt-1">{task.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {task.type}
                    </Badge>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setAddReminderModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full text-xs"
                  onClick={() => navigate("/reminders")}
                >
                  View All Tasks
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Insights */}
        <Card className="therapease-card">
          <CardHeader>
            <CardTitle>Weekly Practice Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sessions Completed</span>
                    <span className="font-medium">25/28 (89%)</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Notes Documented</span>
                    <span className="font-medium">23/25 (92%)</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Invoices Sent</span>
                    <span className="font-medium">18/25 (72%)</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Week Summary</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Excellent week! You're ahead on documentation. Focus on getting those remaining invoices sent to maintain cash flow.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate("/invoices")}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Send Invoices
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate("/notes")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Review Notes
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
      />
      <SessionPrepModal
        open={sessionPrepModalOpen}
        onOpenChange={setSessionPrepModalOpen}
      />
    </Layout>
  );
};

export default Dashboard;
