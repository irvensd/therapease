import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Search,
  Filter,
  User,
  Trash2,
  MoreHorizontal,
  CalendarDays,
  List,
  MoreVertical,
} from "lucide-react";
import { ScheduleSessionModal } from "@/components/modals/ScheduleSessionModal";
import { SessionCalendarModal } from "@/components/modals/SessionCalendarModal";
import { SessionWorkspaceModal } from "@/components/modals/SessionWorkspaceModal";
import { SessionPrepModal } from "@/components/modals/SessionPrepModal";

// Types for better type safety
interface Session {
  id: number;
  clientName: string;
  clientId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type:
    | "Individual Therapy"
    | "Couples Therapy"
    | "Family Therapy"
    | "Group Therapy";
  format: "In-Person" | "Telehealth" | "Phone Call";
  status: "confirmed" | "pending" | "completed" | "cancelled" | "no-show";
  sessionNumber: number;
  treatmentFocus: string;
  location?: string;
  notes?: string;
  diagnosis?: string;
  isRecurring: boolean;
}

interface SessionStats {
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  completionRate: number;
  totalHours: number;
}

// Mock session data
const mockSessions: Session[] = [
  {
    id: 1,
    clientName: "Emma Thompson",
    clientId: "c1",
    date: "2024-11-22",
    time: "9:00 AM",
    duration: 60,
    type: "Individual Therapy",
    format: "In-Person",
    status: "confirmed",
    sessionNumber: 12,
    treatmentFocus: "Anxiety Management",
    notes: "Client showing good progress with breathing techniques",
    isRecurring: true,
    diagnosis: "Generalized Anxiety Disorder",
  },
  {
    id: 2,
    clientName: "Michael Chen",
    clientId: "c2",
    date: "2024-11-22",
    time: "10:30 AM",
    duration: 90,
    type: "Couples Therapy",
    format: "Telehealth",
    status: "confirmed",
    sessionNumber: 8,
    treatmentFocus: "Communication Skills",
    notes: "Working on active listening exercises",
    isRecurring: true,
    diagnosis: "Relationship Issues",
  },
  {
    id: 3,
    clientName: "Sarah Johnson",
    clientId: "c3",
    date: "2024-11-22",
    time: "1:00 PM",
    duration: 60,
    type: "Individual Therapy",
    format: "In-Person",
    status: "pending",
    sessionNumber: 15,
    treatmentFocus: "Depression & Self-Esteem",
    notes: "Follow up on homework completion",
    isRecurring: false,
    diagnosis: "Major Depressive Disorder",
  },
  {
    id: 4,
    clientName: "David Wilson",
    clientId: "c4",
    date: "2024-11-22",
    time: "2:30 PM",
    duration: 75,
    type: "Family Therapy",
    format: "In-Person",
    status: "confirmed",
    sessionNumber: 5,
    treatmentFocus: "Teen Behavioral Issues",
    notes: "Include parents in session",
    isRecurring: true,
    diagnosis: "Oppositional Defiant Disorder",
  },
  {
    id: 5,
    clientName: "Lisa Park",
    clientId: "c5",
    date: "2024-11-22",
    time: "4:00 PM",
    duration: 60,
    type: "Individual Therapy",
    format: "Telehealth",
    status: "confirmed",
    sessionNumber: 22,
    treatmentFocus: "PTSD Recovery",
    notes: "EMDR session planned",
    isRecurring: true,
    diagnosis: "Post-Traumatic Stress Disorder",
  },
  {
    id: 6,
    clientName: "Emma Thompson",
    clientId: "c1",
    date: "2024-11-25",
    time: "9:00 AM",
    duration: 60,
    type: "Individual Therapy",
    format: "In-Person",
    status: "confirmed",
    sessionNumber: 13,
    treatmentFocus: "Anxiety Management",
    notes: "Regular weekly session",
    isRecurring: true,
    diagnosis: "Generalized Anxiety Disorder",
  },
  {
    id: 7,
    clientName: "John Martinez",
    clientId: "c6",
    date: "2024-11-25",
    time: "11:00 AM",
    duration: 60,
    type: "Individual Therapy",
    format: "In-Person",
    status: "completed",
    sessionNumber: 7,
    treatmentFocus: "Substance Abuse Recovery",
    notes: "Excellent progress this week",
    isRecurring: true,
    diagnosis: "Substance Use Disorder",
  },
];

const Sessions = () => {
  const navigate = useNavigate();
  const { id: sessionId } = useParams();
  const { toast } = useToast();
  const { showModal, ModalComponent } = useConfirmationModal();

  // State management
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Handle session ID in URL
  useEffect(() => {
    if (sessionId) {
      // Find the session by ID
      const session = sessions.find(s => s.id.toString() === sessionId);
      if (session) {
        // Show session details in a toast and redirect back to sessions list
        toast({
          title: "Session Details",
          description: `Viewing session with ${session.clientName} on ${session.date} at ${session.time}`,
        });
        // Set the session as selected for any modals
        setSelectedSession(session);
      } else {
        // Session not found
        toast({
          title: "Session Not Found",
          description: "The requested session could not be found.",
          variant: "destructive",
        });
      }
      // Redirect back to sessions list to avoid invalid URL state
      navigate("/sessions", { replace: true });
    }
  }, [sessionId, sessions, navigate, toast]);

  // Calculate statistics
  const stats = useMemo((): SessionStats => {
    const total = sessions.length;
    const completed = sessions.filter((s) => s.status === "completed").length;
    const upcoming = sessions.filter(
      (s) => s.status === "confirmed" || s.status === "pending",
    ).length;
    const totalMinutes = sessions.reduce(
      (acc, session) => acc + session.duration,
      0,
    );

    return {
      totalSessions: total,
      completedSessions: completed,
      upcomingSessions: upcoming,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    };
  }, [sessions]);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        session.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.treatmentFocus
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        session.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || session.status === statusFilter;
      const matchesType = typeFilter === "all" || session.type === typeFilter;

      const today = new Date();
      const sessionDate = new Date(session.date);
      let matchesDate = true;

      if (dateFilter === "today") {
        matchesDate = sessionDate.toDateString() === today.toDateString();
      } else if (dateFilter === "week") {
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        matchesDate = sessionDate >= today && sessionDate <= weekFromNow;
      } else if (dateFilter === "past") {
        matchesDate = sessionDate < today;
      } else if (dateFilter === "future") {
        matchesDate = sessionDate > today;
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [sessions, searchTerm, statusFilter, typeFilter, dateFilter]);

  // Session actions
  const handleSessionAction = useCallback(
    (action: string, session: Session) => {
      setSelectedSession(session);

      switch (action) {
        case "view":
          // Open session details
          navigate(`/sessions/${session.id}`);
          break;

        case "edit":
          setScheduleModalOpen(true);
          break;

        case "complete":
          showModal({
            type: "success",
            title: "Complete Session",
            message: `Mark session with ${session.clientName} as completed?`,
            confirmLabel: "Complete Session",
            cancelLabel: "Cancel",
            showCancel: true,
            onConfirm: () => {
              setSessions((prev) =>
                prev.map((s) =>
                  s.id === session.id
                    ? { ...s, status: "completed" as const }
                    : s,
                ),
              );
              toast({
                title: "Session Completed",
                description: `Session with ${session.clientName} has been marked as completed.`,
              });
            },
          });
          break;

        case "cancel":
          showModal({
            type: "destructive",
            title: "Cancel Session",
            message: `Are you sure you want to cancel the session with ${session.clientName}?`,
            confirmLabel: "Cancel Session",
            cancelLabel: "Keep Session",
            showCancel: true,
            onConfirm: () => {
              setSessions((prev) =>
                prev.map((s) =>
                  s.id === session.id
                    ? { ...s, status: "cancelled" as const }
                    : s,
                ),
              );
              toast({
                title: "Session Cancelled",
                description: `Session with ${session.clientName} has been cancelled.`,
                variant: "destructive",
              });
            },
          });
          break;

        case "prep":
          setPrepModalOpen(true);
          break;

        case "workspace":
          setWorkspaceModalOpen(true);
          break;

        default:
          break;
      }
    },
    [showModal, navigate, toast],
  );

  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      case "no-show":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: Session["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "cancelled":
        return <XCircle className="h-3 w-3" />;
      case "no-show":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getFormatIcon = (format: Session["format"]) => {
    switch (format) {
      case "In-Person":
        return <MapPin className="h-3 w-3" />;
      case "Telehealth":
        return <Video className="h-3 w-3" />;
      case "Phone Call":
        return <Phone className="h-3 w-3" />;
      default:
        return <MapPin className="h-3 w-3" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading sessions...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-8 w-8" />
              Sessions
            </h1>
            <p className="text-muted-foreground">
              Manage your therapy sessions and appointments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCalendarModalOpen(true)}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            <Button onClick={() => setScheduleModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sessions
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completedSessions}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completionRate.toFixed(1)}%
              </div>
              <Progress value={stats.completionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHours}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Session Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sessions, clients, or treatment focus..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Individual Therapy">
                      Individual
                    </SelectItem>
                    <SelectItem value="Couples Therapy">Couples</SelectItem>
                    <SelectItem value="Family Therapy">Family</SelectItem>
                    <SelectItem value="Group Therapy">Group</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="future">Future</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions ({filteredSessions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Session #</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {session.clientName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {session.treatmentFocus}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {new Date(session.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {session.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{session.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusColor(session.status)}
                          className="flex items-center gap-1 w-fit"
                        >
                          {getStatusIcon(session.status)}
                          {session.status.charAt(0).toUpperCase() +
                            session.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getFormatIcon(session.format)}
                          <span className="text-sm">{session.format}</span>
                        </div>
                      </TableCell>
                      <TableCell>{session.duration} min</TableCell>
                      <TableCell>#{session.sessionNumber}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleSessionAction("view", session)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleSessionAction("prep", session)
                              }
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Session Prep
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleSessionAction("workspace", session)
                              }
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Open Workspace
                            </DropdownMenuItem>
                            {session.status === "confirmed" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleSessionAction("complete", session)
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Complete
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() =>
                                handleSessionAction("edit", session)
                              }
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Session
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleSessionAction("cancel", session)
                              }
                              className="text-red-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel Session
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredSessions.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No sessions found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try adjusting your search or filters"
                      : "Schedule your first session to get started"}
                  </p>
                  <Button onClick={() => setScheduleModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        <ScheduleSessionModal
          open={scheduleModalOpen}
          onOpenChange={setScheduleModalOpen}
        />
        <SessionCalendarModal
          open={calendarModalOpen}
          onOpenChange={setCalendarModalOpen}
        />
        <SessionWorkspaceModal
          open={workspaceModalOpen}
          onOpenChange={setWorkspaceModalOpen}
          session={selectedSession}
        />
        <SessionPrepModal
          open={prepModalOpen}
          onOpenChange={setPrepModalOpen}
          session={selectedSession}
        />
        <ModalComponent />
      </div>
    </Layout>
  );
};

export default Sessions;
