import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Plus,
  Clock,
  Search,
  Filter,
  User,
  Phone,
  Video,
  FileText,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  MoreHorizontal,
  CalendarDays,
  List,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScheduleSessionModal } from "@/components/modals/ScheduleSessionModal";
import { SessionWorkspaceModal } from "@/components/modals/SessionWorkspaceModal";
import { SessionPrepModal } from "@/components/modals/SessionPrepModal";

// Mock session data
const mockSessions = [
  {
    id: 1,
    clientName: "Emma Thompson",
    clientId: "c1",
    date: "2024-11-22",
    time: "9:00 AM",
    duration: 60,
    type: "Individual Therapy",
    status: "confirmed",
    sessionNumber: 12,
    treatmentFocus: "Anxiety Management",
    location: "In-Person",
    notes: "Client showing good progress with breathing techniques",
    isRecurring: true,
  },
  {
    id: 2,
    clientName: "Michael Chen",
    clientId: "c2", 
    date: "2024-11-22",
    time: "10:30 AM",
    duration: 90,
    type: "Couples Therapy",
    status: "confirmed",
    sessionNumber: 8,
    treatmentFocus: "Communication Skills",
    location: "Telehealth",
    notes: "Working on active listening exercises",
    isRecurring: true,
  },
  {
    id: 3,
    clientName: "Sarah Johnson",
    clientId: "c3",
    date: "2024-11-22",
    time: "1:00 PM", 
    duration: 60,
    type: "Individual Therapy",
    status: "pending",
    sessionNumber: 15,
    treatmentFocus: "Depression & Self-Esteem",
    location: "In-Person",
    notes: "Follow up on homework completion",
    isRecurring: false,
  },
  {
    id: 4,
    clientName: "David Wilson",
    clientId: "c4",
    date: "2024-11-22",
    time: "2:30 PM",
    duration: 75,
    type: "Family Therapy",
    status: "confirmed",
    sessionNumber: 5,
    treatmentFocus: "Teen Behavioral Issues",
    location: "In-Person",
    notes: "Include parents in session",
    isRecurring: true,
  },
  {
    id: 5,
    clientName: "Lisa Park",
    clientId: "c5",
    date: "2024-11-22",
    time: "4:00 PM",
    duration: 60,
    type: "Individual Therapy", 
    status: "confirmed",
    sessionNumber: 22,
    treatmentFocus: "PTSD Recovery",
    location: "Telehealth",
    notes: "EMDR session planned",
    isRecurring: true,
  },
  // Next week sessions
  {
    id: 6,
    clientName: "Emma Thompson",
    clientId: "c1",
    date: "2024-11-25",
    time: "9:00 AM",
    duration: 60,
    type: "Individual Therapy",
    status: "confirmed",
    sessionNumber: 13,
    treatmentFocus: "Anxiety Management",
    location: "In-Person",
    notes: "Regular weekly session",
    isRecurring: true,
  },
  {
    id: 7,
    clientName: "John Martinez",
    clientId: "c6",
    date: "2024-11-25",
    time: "11:00 AM",
    duration: 60,
    type: "Initial Consultation",
    status: "pending",
    sessionNumber: 1,
    treatmentFocus: "Assessment",
    location: "In-Person",
    notes: "New client intake",
    isRecurring: false,
  },
  {
    id: 8,
    clientName: "Rebecca Williams",
    clientId: "c7",
    date: "2024-11-26",
    time: "3:00 PM",
    duration: 60,
    type: "Individual Therapy",
    status: "cancelled",
    sessionNumber: 9,
    treatmentFocus: "Grief Counseling",
    location: "Telehealth",
    notes: "Client requested reschedule",
    isRecurring: false,
  },
  {
    id: 9,
    clientName: "Alex Rodriguez",
    clientId: "c8",
    date: "2024-11-27",
    time: "10:00 AM",
    duration: 90,
    type: "Group Therapy",
    status: "confirmed", 
    sessionNumber: 4,
    treatmentFocus: "Addiction Recovery",
    location: "In-Person",
    notes: "Group dynamics session",
    isRecurring: true,
  },
  {
    id: 10,
    clientName: "Maria Santos",
    clientId: "c9",
    date: "2024-11-28",
    time: "2:00 PM",
    duration: 60,
    type: "Individual Therapy",
    status: "completed",
    sessionNumber: 18,
    treatmentFocus: "Career Transition",
    location: "Telehealth", 
    notes: "Made significant breakthrough",
    isRecurring: true,
  },
];

const Sessions = () => {
  const navigate = useNavigate();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [sessionWorkspaceModalOpen, setSessionWorkspaceModalOpen] = useState(false);
  const [sessionPrepModalOpen, setSessionPrepModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Filter sessions based on search and filters
  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = session.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.treatmentFocus.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    const matchesType = typeFilter === "all" || session.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Group sessions by date
  const sessionsByDate = filteredSessions.reduce((acc, session) => {
    const date = session.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, typeof mockSessions>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Individual Therapy": return User;
      case "Couples Therapy": return User;
      case "Family Therapy": return User;
      case "Group Therapy": return User;
      case "Initial Consultation": return Calendar;
      default: return User;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const handleStartSession = (session: any) => {
    // Map session data to expected format for SessionWorkspaceModal
    const mappedSession = {
      name: session.clientName,
      type: session.type,
      sessionNumber: session.sessionNumber,
      treatmentFocus: session.treatmentFocus,
      duration: `${session.duration} min`,
      startTime: session.time,
    };
    setSelectedSession(mappedSession);
    setSessionWorkspaceModalOpen(true);
  };

  const handlePrepareSession = (session: any) => {
    // Map session data to expected format for SessionPrepModal
    const mappedSession = {
      name: session.clientName,
      type: session.type,
      sessionNumber: session.sessionNumber,
      treatmentFocus: session.treatmentFocus,
      time: session.time,
      duration: `${session.duration} min`,
    };
    setSelectedSession(mappedSession);
    setSessionPrepModalOpen(true);
  };

  // Calculate stats
  const totalSessions = mockSessions.length;
  const confirmedSessions = mockSessions.filter(s => s.status === "confirmed").length;
  const completedSessions = mockSessions.filter(s => s.status === "completed").length;
  const todaySessions = mockSessions.filter(s => s.date === "2024-11-22").length;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Session Management</h1>
            <p className="text-muted-foreground">
              Schedule, track, and manage your therapy sessions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}>
              {viewMode === "list" ? <CalendarDays className="mr-2 h-4 w-4" /> : <List className="mr-2 h-4 w-4" />}
              {viewMode === "list" ? "Calendar View" : "List View"}
            </Button>
            <Button onClick={() => setScheduleModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Today's Sessions</p>
                  <p className="text-2xl font-bold">{todaySessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold">{confirmedSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search sessions by client name or treatment focus..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Individual Therapy">Individual</SelectItem>
                  <SelectItem value="Couples Therapy">Couples</SelectItem>
                  <SelectItem value="Family Therapy">Family</SelectItem>
                  <SelectItem value="Group Therapy">Group</SelectItem>
                  <SelectItem value="Initial Consultation">Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <div className="space-y-6">
          {Object.entries(sessionsByDate).map(([date, sessions]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  {formatDate(date)}
                  <Badge variant="outline" className="ml-2">
                    {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => {
                    const TypeIcon = getTypeIcon(session.type);
                    return (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <TypeIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{session.clientName}</h3>
                              <Badge className={getStatusColor(session.status)}>
                                {session.status}
                              </Badge>
                              {session.isRecurring && (
                                <Badge variant="outline" className="text-xs">
                                  Recurring
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {session.time} • {session.duration} min
                              </span>
                              <span>{session.type} • Session #{session.sessionNumber}</span>
                              <span className="flex items-center gap-1">
                                {session.location === "Telehealth" ? (
                                  <Video className="h-3 w-3" />
                                ) : (
                                  <User className="h-3 w-3" />
                                )}
                                {session.location}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {session.treatmentFocus} • {session.notes}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.status === "confirmed" && date === "2024-11-22" && (
                            <Button size="sm" onClick={() => handleStartSession(session)}>
                              Start Session
                            </Button>
                          )}
                          {session.status !== "completed" && session.status !== "cancelled" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePrepareSession(session)}
                            >
                              <FileText className="mr-1 h-3 w-3" />
                              Prepare
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Session
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Notes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel Session
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sessions found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or schedule a new session.
              </p>
              <Button onClick={() => setScheduleModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <ScheduleSessionModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
      />
      <SessionWorkspaceModal
        open={sessionWorkspaceModalOpen}
        onOpenChange={setSessionWorkspaceModalOpen}
        client={selectedSession}
      />
      <SessionPrepModal
        open={sessionPrepModalOpen}
        onOpenChange={setSessionPrepModalOpen}
        client={selectedSession}
      />
    </Layout>
  );
};

export default Sessions;
