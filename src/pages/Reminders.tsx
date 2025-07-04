import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Loader2,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Star,
  StarOff,
} from "lucide-react";
import { AddReminderModal } from "@/components/modals/AddReminderModal";

// Types for better type safety
interface Reminder {
  id: number;
  title: string;
  description: string;
  category:
    | "Client Follow-up"
    | "Documentation"
    | "Administrative"
    | "Professional"
    | "Personal";
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "completed" | "snoozed" | "overdue";
  dueDate: string;
  dueTime?: string;
  createdAt: string;
  completedAt?: string;
  clientName?: string;
  isStarred: boolean;
  notes?: string;
  recurringType?: "none" | "daily" | "weekly" | "monthly";
}

interface ReminderStats {
  totalReminders: number;
  activeReminders: number;
  completedToday: number;
  overdueReminders: number;
  dueToday: number;
  completionRate: number;
}

const Reminders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showModal, ModalComponent } = useConfirmationModal();

  // State management
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addReminderModalOpen, setAddReminderModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // Mock reminders data - in real app would be fetched from API
  const mockReminders: Reminder[] = [
    {
      id: 1,
      title: "Follow up with Emma Thompson",
      description:
        "Session notes completion overdue - need to finalize SOAP documentation",
      category: "Documentation",
      priority: "urgent",
      status: "overdue",
      dueDate: "2024-01-20",
      dueTime: "17:00",
      createdAt: "2024-01-18T10:00:00",
      clientName: "Emma Thompson",
      isStarred: true,
      notes: "Client had breakthrough in anxiety management last session",
      recurringType: "none",
    },
    {
      id: 2,
      title: "Insurance authorization renewal",
      description:
        "Michael Chen - Blue Cross authorization expires end of month",
      category: "Administrative",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-25",
      dueTime: "12:00",
      createdAt: "2024-01-15T14:30:00",
      clientName: "Michael Chen",
      isStarred: true,
      notes: "Need to submit form 1023 with updated treatment plan",
      recurringType: "none",
    },
    {
      id: 3,
      title: "Quarterly treatment plan review",
      description:
        "Sarah Johnson - 3-month progress evaluation and goal adjustment",
      category: "Client Follow-up",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-26",
      dueTime: "14:00",
      createdAt: "2024-01-10T09:00:00",
      clientName: "Sarah Johnson",
      isStarred: false,
      notes: "Focus on PTSD symptom improvement and coping strategies",
      recurringType: "none",
    },
    {
      id: 4,
      title: "Weekly supervision meeting",
      description: "Discuss complex cases with clinical supervisor",
      category: "Professional",
      priority: "medium",
      status: "pending",
      dueDate: "2024-01-24",
      dueTime: "15:00",
      createdAt: "2024-01-17T08:00:00",
      isStarred: false,
      notes: "Prepare Wilson family case study and Chen couple's progress",
      recurringType: "weekly",
    },
    {
      id: 5,
      title: "License renewal documentation",
      description:
        "Submit continuing education credits and renewal application",
      category: "Professional",
      priority: "medium",
      status: "pending",
      dueDate: "2024-02-15",
      dueTime: "17:00",
      createdAt: "2024-01-05T16:00:00",
      isStarred: false,
      notes: "Need 40 CEU credits - currently have 35 completed",
      recurringType: "none",
    },
    {
      id: 6,
      title: "Schedule family session",
      description: "David Wilson family - follow-up after individual sessions",
      category: "Client Follow-up",
      priority: "medium",
      status: "completed",
      dueDate: "2024-01-19",
      dueTime: "10:00",
      createdAt: "2024-01-16T11:00:00",
      completedAt: "2024-01-19T09:30:00",
      clientName: "David Wilson",
      isStarred: false,
      notes: "Session scheduled for Friday 2 PM",
      recurringType: "none",
    },
    {
      id: 7,
      title: "Update treatment notes",
      description: "Complete progress notes for this week's sessions",
      category: "Documentation",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-23",
      dueTime: "18:00",
      createdAt: "2024-01-22T12:00:00",
      isStarred: false,
      notes: "5 sessions need documentation",
      recurringType: "weekly",
    },
  ];

  // Load reminders data on mount
  useEffect(() => {
    const loadReminders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setReminders(mockReminders);
      } catch (err) {
        setError("Failed to load reminder data. Please try again.");
        toast({
          variant: "destructive",
          title: "Error Loading Reminders",
          description: "There was a problem loading your reminders.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadReminders();
  }, [toast]);

  // Memoized computed values to prevent infinite loops
  const filteredReminders = useMemo(() => {
    return reminders.filter((reminder) => {
      const matchesSearch =
        reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reminder.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reminder.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reminder.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || reminder.category === categoryFilter;
      const matchesPriority =
        priorityFilter === "all" || reminder.priority === priorityFilter;

      let matchesStatus = true;
      if (statusFilter === "active") {
        matchesStatus =
          reminder.status === "pending" || reminder.status === "overdue";
      } else if (statusFilter !== "all") {
        matchesStatus = reminder.status === statusFilter;
      }

      const matchesStarred = !showStarredOnly || reminder.isStarred;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority &&
        matchesStatus &&
        matchesStarred
      );
    });
  }, [
    reminders,
    searchTerm,
    categoryFilter,
    priorityFilter,
    statusFilter,
    showStarredOnly,
  ]);

  const reminderStats: ReminderStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    return {
      totalReminders: reminders.length,
      activeReminders: reminders.filter(
        (r) => r.status === "pending" || r.status === "overdue",
      ).length,
      completedToday: reminders.filter(
        (r) => r.completedAt && r.completedAt.startsWith(today),
      ).length,
      overdueReminders: reminders.filter((r) => r.status === "overdue").length,
      dueToday: reminders.filter(
        (r) => r.dueDate === today && r.status === "pending",
      ).length,
      completionRate:
        reminders.length > 0
          ? Math.round(
              (reminders.filter((r) => r.status === "completed").length /
                reminders.length) *
                100,
            )
          : 0,
    };
  }, [reminders]);

  // Utility functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "snoozed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Client Follow-up":
        return <Users className="h-3 w-3" />;
      case "Documentation":
        return <FileText className="h-3 w-3" />;
      case "Administrative":
        return <Clock className="h-3 w-3" />;
      case "Professional":
        return <TrendingUp className="h-3 w-3" />;
      default:
        return <Bell className="h-3 w-3" />;
    }
  };

  // Action handlers with proper error handling
  const handleToggleStar = useCallback(
    (reminderId: number) => {
      setReminders((prev) => {
        const updated = prev.map((reminder) =>
          reminder.id === reminderId
            ? { ...reminder, isStarred: !reminder.isStarred }
            : reminder,
        );

        const updatedReminder = updated.find((r) => r.id === reminderId);
        if (updatedReminder) {
          toast({
            title: updatedReminder.isStarred
              ? "Added to Starred"
              : "Removed from Starred",
            description: `"${updatedReminder.title}" ${updatedReminder.isStarred ? "added to" : "removed from"} starred reminders.`,
          });
        }

        return updated;
      });
    },
    [toast],
  );

  const handleCompleteReminder = useCallback(
    (reminder: Reminder) => {
      setReminders((prev) =>
        prev.map((r) =>
          r.id === reminder.id
            ? {
                ...r,
                status: "completed" as const,
                completedAt: new Date().toISOString(),
              }
            : r,
        ),
      );

      toast({
        title: "Reminder Completed",
        description: `"${reminder.title}" has been marked as completed.`,
      });
    },
    [toast],
  );

  const handleSnoozeReminder = useCallback(
    (reminder: Reminder) => {
      showModal({
        type: "info",
        title: "Snooze Reminder",
        message: `Snooze "${reminder.title}" for how long?\n\n• 1 hour\n• 4 hours\n• Tomorrow\n• Next week\n\nThis feature will be available in the next update.`,
        confirmLabel: "Got it",
      });
    },
    [showModal],
  );

  const handleDeleteReminder = useCallback(
    (reminder: Reminder) => {
      showModal({
        type: "destructive",
        title: "Delete Reminder",
        message: `Are you sure you want to permanently delete "${reminder.title}"? This action cannot be undone.`,
        confirmLabel: "Delete Reminder",
        cancelLabel: "Cancel",
        showCancel: true,
        onConfirm: () => {
          setReminders((prev) => prev.filter((r) => r.id !== reminder.id));
          toast({
            title: "Reminder Deleted",
            description: `"${reminder.title}" has been permanently deleted.`,
          });
        },
      });
    },
    [showModal, toast],
  );

  const handleViewReminder = useCallback(
    (reminder: Reminder) => {
      const formattedDueDate = new Date(reminder.dueDate).toLocaleDateString();
      const modalMessage = [
        `Title: ${reminder.title}`,
        `Description: ${reminder.description}`,
        `Category: ${reminder.category}`,
        `Priority: ${reminder.priority.toUpperCase()}`,
        `Status: ${reminder.status.toUpperCase()}`,
        `Due Date: ${formattedDueDate}${reminder.dueTime ? ` at ${reminder.dueTime}` : ""}`,
        reminder.clientName ? `Client: ${reminder.clientName}` : "",
        reminder.notes ? `Notes: ${reminder.notes}` : "",
        reminder.recurringType !== "none"
          ? `Recurring: ${reminder.recurringType}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");

      showModal({
        type: "info",
        title: `Reminder Details`,
        message: modalMessage,
        confirmLabel: "Close",
      });
    },
    [showModal],
  );

  const handleExportReminders = useCallback(() => {
    try {
      const csvHeaders = [
        "Title",
        "Description",
        "Category",
        "Priority",
        "Status",
        "Due Date",
        "Due Time",
        "Client",
        "Notes",
        "Created",
        "Completed",
      ];

      const csvContent = filteredReminders.map((reminder) =>
        [
          `"${reminder.title.replace(/"/g, '""')}"`,
          `"${reminder.description.replace(/"/g, '""')}"`,
          `"${reminder.category}"`,
          `"${reminder.priority}"`,
          `"${reminder.status}"`,
          `"${new Date(reminder.dueDate).toLocaleDateString()}"`,
          `"${reminder.dueTime || ""}"`,
          `"${reminder.clientName || ""}"`,
          `"${reminder.notes?.replace(/"/g, '""') || ""}"`,
          `"${new Date(reminder.createdAt).toLocaleDateString()}"`,
          `"${reminder.completedAt ? new Date(reminder.completedAt).toLocaleDateString() : ""}"`,
        ].join(","),
      );

      const csvData = [csvHeaders.join(","), ...csvContent].join("\n");

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reminders-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${filteredReminders.length} reminders to CSV file.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export reminders data. Please try again.",
      });
    }
  }, [filteredReminders, toast]);

  const handleReminderModalClose = useCallback((open: boolean) => {
    setAddReminderModalOpen(open);
    if (!open) {
      setEditingReminder(null);
    }
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading reminders...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold">Reminders</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Stay on top of important tasks and deadlines
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleExportReminders}
              disabled={filteredReminders.length === 0}
              className="shrink-0"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV ({filteredReminders.length})
            </Button>
            <Button
              onClick={() => {
                setEditingReminder(null);
                setAddReminderModalOpen(true);
              }}
              className="shrink-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Reminder
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {reminderStats.activeReminders}
              </div>
              <p className="text-xs text-muted-foreground">
                {reminderStats.overdueReminders} overdue
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                Due Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-orange-600">
                {reminderStats.dueToday}
              </div>
              <p className="text-xs text-muted-foreground">need attention</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Completed Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {reminderStats.completedToday}
              </div>
              <p className="text-xs text-muted-foreground">tasks done</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {reminderStats.completionRate}%
              </div>
              <Progress
                value={reminderStats.completionRate}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="therapease-card">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle>Reminder Management</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search reminders, clients, or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Button
                  variant={showStarredOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowStarredOnly(!showStarredOnly)}
                >
                  {showStarredOnly ? (
                    <Star className="h-4 w-4 fill-current" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="snoozed">Snoozed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Client Follow-up">
                    Client Follow-up
                  </SelectItem>
                  <SelectItem value="Documentation">Documentation</SelectItem>
                  <SelectItem value="Administrative">Administrative</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">
                        Task & Details
                      </TableHead>
                      <TableHead className="min-w-[120px] hidden sm:table-cell">
                        Due Date
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        Priority & Status
                      </TableHead>
                      <TableHead className="min-w-[120px] hidden md:table-cell">
                        Category
                      </TableHead>
                      <TableHead className="min-w-[150px] hidden lg:table-cell">
                        Client/Notes
                      </TableHead>
                      <TableHead className="w-[140px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReminders.map((reminder) => (
                      <TableRow
                        key={reminder.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium truncate max-w-[150px] sm:max-w-none">
                                {reminder.title}
                              </div>
                              {reminder.isStarred && (
                                <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {reminder.description}
                            </div>
                            {/* Mobile-only due date */}
                            <div className="sm:hidden mt-1 text-xs text-muted-foreground">
                              Due:{" "}
                              {new Date(reminder.dueDate).toLocaleDateString()}
                              {reminder.dueTime && ` at ${reminder.dueTime}`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="text-sm">
                            <div className="font-medium">
                              {new Date(reminder.dueDate).toLocaleDateString()}
                            </div>
                            {reminder.dueTime && (
                              <div className="text-muted-foreground">
                                {reminder.dueTime}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge
                              className={getPriorityColor(reminder.priority)}
                              variant="outline"
                            >
                              {reminder.priority.toUpperCase()}
                            </Badge>
                            <Badge
                              className={getStatusColor(reminder.status)}
                              variant="outline"
                            >
                              {reminder.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1 text-sm">
                            {getCategoryIcon(reminder.category)}
                            <span className="truncate">
                              {reminder.category}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-sm">
                            {reminder.clientName && (
                              <div className="font-medium">
                                {reminder.clientName}
                              </div>
                            )}
                            {reminder.notes && (
                              <div className="text-muted-foreground truncate max-w-[120px]">
                                {reminder.notes}
                              </div>
                            )}
                            {!reminder.clientName && !reminder.notes && (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStar(reminder.id)}
                            >
                              {reminder.isStarred ? (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                            {reminder.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCompleteReminder(reminder)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewReminder(reminder)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Reminder
                                </DropdownMenuItem>
                                {reminder.status === "pending" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleSnoozeReminder(reminder)
                                    }
                                  >
                                    <Clock className="mr-2 h-4 w-4" />
                                    Snooze
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteReminder(reminder)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {filteredReminders.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-medium">
                  No reminders found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm ||
                  categoryFilter !== "all" ||
                  priorityFilter !== "all" ||
                  statusFilter !== "active"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first reminder to get started"}
                </p>
                {!searchTerm &&
                  categoryFilter === "all" &&
                  priorityFilter === "all" &&
                  statusFilter === "active" && (
                    <Button
                      className="mt-4"
                      onClick={() => setAddReminderModalOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Reminder
                    </Button>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddReminderModal
        open={addReminderModalOpen}
        onOpenChange={handleReminderModalClose}
      />
      <ModalComponent />
    </Layout>
  );
};

export default Reminders;
