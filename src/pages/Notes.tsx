import { useState, useEffect, useCallback } from "react";
import Layout from "@/components/Layout";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  FileText,
  Plus,
  Search,
  Archive,
  Users,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  Download,
  Loader2,
  AlertCircle,
  Star,
  StarOff,
  Lock,
  CheckCircle,
  FileCheck,
  Mic,
} from "lucide-react";
import { NewNoteModal } from "@/components/modals/NewNoteModal";

// Types for better type safety
interface Note {
  id: number;
  title: string;
  clientName: string;
  sessionDate: string;
  createdAt: string;
  updatedAt: string;
  type: "SOAP" | "DAP" | "BIRP" | "Progress" | "Assessment" | "Treatment Plan";
  status: "Draft" | "Complete" | "Reviewed" | "Archived";
  tags: string[];
  wordCount: number;
  content: string;
  isStarred: boolean;
  isConfidential: boolean;
  sessionDuration: number; // in minutes
  diagnosis: string;
}

interface NotesStats {
  totalNotes: number;
  draftNotes: number;
  completedNotes: number;
  starredNotes: number;
  todaysNotes: number;
  averageWordCount: number;
}

const Notes = () => {
  const { toast } = useToast();
  const { showModal, ModalComponent } = useConfirmationModal();

  // State management
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNoteModalOpen, setNewNoteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  // Mock notes data - in real app would be fetched from API
  const mockNotes: Note[] = [
    {
      id: 1,
      title: "Initial Assessment - Anxiety Treatment",
      clientName: "Emma Thompson",
      sessionDate: "2024-01-22",
      createdAt: "2024-01-22T10:30:00",
      updatedAt: "2024-01-22T11:15:00",
      type: "SOAP",
      status: "Complete",
      tags: ["anxiety", "initial-assessment", "CBT"],
      wordCount: 485,
      content:
        "Subjective: Client reports increased anxiety levels over the past month...",
      isStarred: true,
      isConfidential: true,
      sessionDuration: 50,
      diagnosis: "Generalized Anxiety Disorder",
    },
    {
      id: 2,
      title: "Progress Review - Week 4",
      clientName: "Michael Chen",
      sessionDate: "2024-01-21",
      createdAt: "2024-01-21T15:00:00",
      updatedAt: "2024-01-21T15:45:00",
      type: "Progress",
      status: "Complete",
      tags: ["couples-therapy", "communication", "progress"],
      wordCount: 320,
      content:
        "Couple demonstrated improved communication techniques discussed in previous sessions...",
      isStarred: false,
      isConfidential: true,
      sessionDuration: 60,
      diagnosis: "Relationship Issues",
    },
    {
      id: 3,
      title: "Crisis Intervention Session",
      clientName: "Sarah Johnson",
      sessionDate: "2024-01-20",
      createdAt: "2024-01-20T14:30:00",
      updatedAt: "2024-01-20T16:00:00",
      type: "BIRP",
      status: "Reviewed",
      tags: ["crisis", "PTSD", "emergency"],
      wordCount: 680,
      content:
        "Behavior: Client presented in distressed state following triggering event...",
      isStarred: true,
      isConfidential: true,
      sessionDuration: 75,
      diagnosis: "PTSD",
    },
    {
      id: 4,
      title: "Family Therapy Session #6",
      clientName: "Wilson Family",
      sessionDate: "2024-01-19",
      createdAt: "2024-01-19T16:30:00",
      updatedAt: "2024-01-19T17:30:00",
      type: "DAP",
      status: "Complete",
      tags: ["family-therapy", "adolescent", "boundaries"],
      wordCount: 425,
      content:
        "Data: Family session focused on establishing healthy boundaries...",
      isStarred: false,
      isConfidential: true,
      sessionDuration: 60,
      diagnosis: "Family Dysfunction",
    },
    {
      id: 5,
      title: "Treatment Plan Update",
      clientName: "Lisa Rodriguez",
      sessionDate: "2024-01-18",
      createdAt: "2024-01-18T11:00:00",
      updatedAt: "2024-01-22T09:30:00",
      type: "Treatment Plan",
      status: "Draft",
      tags: ["treatment-plan", "depression", "medication"],
      wordCount: 250,
      content: "Updated treatment goals following psychiatric consultation...",
      isStarred: false,
      isConfidential: true,
      sessionDuration: 45,
      diagnosis: "Major Depressive Disorder",
    },
    {
      id: 6,
      title: "Cognitive Assessment Results",
      clientName: "Robert Kim",
      sessionDate: "2024-01-17",
      createdAt: "2024-01-17T13:30:00",
      updatedAt: "2024-01-17T14:30:00",
      type: "Assessment",
      status: "Complete",
      tags: ["assessment", "cognitive", "baseline"],
      wordCount: 890,
      content:
        "Comprehensive cognitive assessment reveals mild impairments in attention...",
      isStarred: false,
      isConfidential: true,
      sessionDuration: 90,
      diagnosis: "Attention Deficit Disorder",
    },
  ];

  // Load notes data on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setNotes(mockNotes);
      } catch (err) {
        setError("Failed to load notes data. Please try again.");
        toast({
          variant: "destructive",
          title: "Error Loading Notes",
          description: "There was a problem loading your notes.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, [toast]);

  // Computed values
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesType = typeFilter === "all" || note.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || note.status === statusFilter;
    const matchesClient =
      clientFilter === "all" || note.clientName === clientFilter;
    const matchesStarred = !showStarredOnly || note.isStarred;

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesClient &&
      matchesStarred
    );
  });

  const notesStats: NotesStats = {
    totalNotes: notes.length,
    draftNotes: notes.filter((n) => n.status === "Draft").length,
    completedNotes: notes.filter((n) => n.status === "Complete").length,
    starredNotes: notes.filter((n) => n.isStarred).length,
    todaysNotes: notes.filter((n) => {
      const today = new Date().toISOString().split("T")[0];
      return n.sessionDate === today;
    }).length,
    averageWordCount:
      notes.length > 0
        ? Math.round(
            notes.reduce((sum, n) => sum + n.wordCount, 0) / notes.length,
          )
        : 0,
  };

  const uniqueClients = Array.from(
    new Set(notes.map((n) => n.clientName)),
  ).sort();

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Reviewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "SOAP":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "DAP":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "BIRP":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "Assessment":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      case "Treatment Plan":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Action handlers with proper error handling
  const handleToggleStar = useCallback(
    (noteId: number) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId ? { ...note, isStarred: !note.isStarred } : note,
        ),
      );

      const note = notes.find((n) => n.id === noteId);
      if (note) {
        toast({
          title: note.isStarred ? "Removed from Starred" : "Added to Starred",
          description: `"${note.title}" ${note.isStarred ? "removed from" : "added to"} starred notes.`,
        });
      }
    },
    [notes, toast],
  );

  const handleDeleteNote = useCallback(
    (note: Note) => {
      showModal({
        type: "destructive",
        title: "Delete Note",
        message: `Are you sure you want to delete "${note.title}"? This action cannot be undone.`,
        confirmLabel: "Delete Note",
        cancelLabel: "Cancel",
        showCancel: true,
        onConfirm: () => {
          setNotes((prev) => prev.filter((n) => n.id !== note.id));
          toast({
            title: "Note Deleted",
            description: `"${note.title}" has been permanently deleted.`,
          });
        },
      });
    },
    [showModal, toast],
  );

  const handleArchiveNote = useCallback(
    (note: Note) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === note.id ? { ...n, status: "Archived" as const } : n,
        ),
      );

      toast({
        title: "Note Archived",
        description: `"${note.title}" has been moved to the archive.`,
      });
    },
    [toast],
  );

  const handleViewNote = useCallback(
    (note: Note) => {
      showModal({
        type: "info",
        title: note.title,
        message: `Client: ${note.clientName}\nDate: ${new Date(note.sessionDate).toLocaleDateString()}\nType: ${note.type}\nStatus: ${note.status}\nDuration: ${note.sessionDuration} minutes\nWord Count: ${note.wordCount}\n\nContent Preview:\n${note.content.substring(0, 300)}${note.content.length > 300 ? "..." : ""}`,
        confirmLabel: "Close",
      });
    },
    [showModal],
  );

  const handleExportNotes = useCallback(() => {
    try {
      const csvContent = filteredNotes
        .map(
          (note) =>
            `"${note.title}","${note.clientName}","${note.sessionDate}","${note.type}","${note.status}","${note.wordCount}","${note.sessionDuration}","${note.tags.join("; ")}"`,
        )
        .join("\n");
      const header =
        "Title,Client,Session Date,Type,Status,Word Count,Duration (min),Tags\n";
      const blob = new Blob([header + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `therapy-notes-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${filteredNotes.length} notes to CSV file.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export notes data. Please try again.",
      });
    }
  }, [filteredNotes, toast]);

  const handleSearchNotes = useCallback(() => {
    showModal({
      type: "info",
      title: "Advanced Search Features",
      message:
        "Advanced search includes:\n• Full-text search across note content\n• Client name and tag filtering\n• Date range selection\n• Treatment goal keywords\n• Session type filtering\n• Status and priority sorting\n• Confidentiality level filtering",
      confirmLabel: "Great!",
      onConfirm: () => {
        toast({
          title: "Search Enhanced",
          description:
            "Use the search box above to find notes by content, client, or tags.",
        });
      },
    });
  }, [showModal, toast]);

  const handleVoiceToText = useCallback(() => {
    showModal({
      type: "info",
      title: "Voice-to-Text Integration",
      message:
        "Voice-to-text features coming soon:\n• Real-time dictation during sessions\n• Automatic punctuation and formatting\n• Medical terminology recognition\n• HIPAA-compliant voice processing\n• Integration with session templates\n• Hands-free note creation",
      confirmLabel: "Excited for this!",
      onConfirm: () => {
        toast({
          title: "Feature In Development",
          description:
            "Voice-to-text functionality will be available in the next major update.",
        });
      },
    });
  }, [showModal, toast]);

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading notes...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold">Session Notes</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Create, manage, and organize your therapy session notes
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleVoiceToText}
              className="shrink-0"
              aria-label="Voice-to-text features"
            >
              <Mic className="mr-2 h-4 w-4" aria-hidden="true" />
              Voice Notes
            </Button>
            <Button
              onClick={() => setNewNoteModalOpen(true)}
              className="shrink-0"
              aria-label="Create new note"
            >
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              New Note
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div
          className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4"
          role="region"
          aria-label="Notes statistics"
        >
          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                Total Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-xl sm:text-2xl font-bold"
                aria-label={`${notesStats.totalNotes} total notes`}
              >
                {notesStats.totalNotes}
              </div>
              <p className="text-xs text-muted-foreground">
                {notesStats.averageWordCount} avg words
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
                aria-label={`${notesStats.completedNotes} completed notes`}
              >
                {notesStats.completedNotes}
              </div>
              <p className="text-xs text-muted-foreground">
                {notesStats.draftNotes} drafts pending
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" aria-hidden="true" />
                Starred
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-xl sm:text-2xl font-bold"
                aria-label={`${notesStats.starredNotes} starred notes`}
              >
                {notesStats.starredNotes}
              </div>
              <p className="text-xs text-muted-foreground">important notes</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar
                  className="h-4 w-4 text-blue-600"
                  aria-hidden="true"
                />
                Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-xl sm:text-2xl font-bold"
                aria-label={`${notesStats.todaysNotes} notes created today`}
              >
                {notesStats.todaysNotes}
              </div>
              <p className="text-xs text-muted-foreground">notes created</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                Template Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                HIPAA-compliant templates: SOAP, DAP, BIRP, and custom formats
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setNewNoteModalOpen(true)}
                aria-label="Create note with template"
              >
                <FileCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                Create with Template
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" aria-hidden="true" />
                Advanced Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Search by content, client, tags, date ranges, and treatment
                goals
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSearchNotes}
                aria-label="Learn about search features"
              >
                <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                Search Features
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-primary" aria-hidden="true" />
                Secure Archive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Encrypted storage with HIPAA compliance for long-term retention
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStatusFilter("archived")}
                aria-label="View archived notes"
              >
                <Lock className="mr-2 h-4 w-4" aria-hidden="true" />
                View Archive
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="therapease-card">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle>Notes Management</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                    aria-hidden="true"
                  />
                  <Input
                    placeholder="Search notes, clients, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                    aria-label="Search notes"
                  />
                </div>
                <Button
                  variant={showStarredOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowStarredOnly(!showStarredOnly)}
                  aria-label={
                    showStarredOnly
                      ? "Show all notes"
                      : "Show starred notes only"
                  }
                >
                  {showStarredOnly ? (
                    <Star className="h-4 w-4 fill-current" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportNotes}
                  disabled={filteredNotes.length === 0}
                  aria-label={`Export ${filteredNotes.length} notes to CSV`}
                >
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Export
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Note Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SOAP">SOAP</SelectItem>
                  <SelectItem value="DAP">DAP</SelectItem>
                  <SelectItem value="BIRP">BIRP</SelectItem>
                  <SelectItem value="Progress">Progress</SelectItem>
                  <SelectItem value="Assessment">Assessment</SelectItem>
                  <SelectItem value="Treatment Plan">Treatment Plan</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Reviewed">Reviewed</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {uniqueClients.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
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
                        Note & Client
                      </TableHead>
                      <TableHead className="min-w-[120px] hidden sm:table-cell">
                        Date & Time
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        Type & Status
                      </TableHead>
                      <TableHead className="min-w-[100px] hidden md:table-cell">
                        Details
                      </TableHead>
                      <TableHead className="min-w-[150px] hidden lg:table-cell">
                        Tags
                      </TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotes.map((note) => (
                      <TableRow
                        key={note.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium truncate max-w-[150px] sm:max-w-none">
                                {note.title}
                              </div>
                              {note.isStarred && (
                                <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                              )}
                              {note.isConfidential && (
                                <Lock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {note.clientName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {note.diagnosis}
                            </div>
                            {/* Mobile-only date info */}
                            <div className="sm:hidden mt-1 text-xs text-muted-foreground">
                              {new Date(note.sessionDate).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="text-sm">
                            <div className="font-medium">
                              {new Date(note.sessionDate).toLocaleDateString()}
                            </div>
                            <div className="text-muted-foreground">
                              {note.sessionDuration}min session
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge
                              className={getTypeColor(note.type)}
                              variant="outline"
                            >
                              {note.type}
                            </Badge>
                            <Badge
                              className={getStatusColor(note.status)}
                              variant="outline"
                            >
                              {note.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">
                            <div className="font-medium">
                              {note.wordCount} words
                            </div>
                            <div className="text-muted-foreground">
                              Updated{" "}
                              {new Date(note.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {note.tags.slice(0, 3).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {note.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{note.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStar(note.id)}
                              aria-label={
                                note.isStarred
                                  ? "Remove from starred"
                                  : "Add to starred"
                              }
                            >
                              {note.isStarred ? (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  aria-label={`Actions for note: ${note.title}`}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewNote(note)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Note
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleArchiveNote(note)}
                                >
                                  <Archive className="mr-2 h-4 w-4" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteNote(note)}
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

            {filteredNotes.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-medium">
                  No notes found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm ||
                  typeFilter !== "all" ||
                  statusFilter !== "all" ||
                  clientFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first session note to get started"}
                </p>
                {!searchTerm &&
                  typeFilter === "all" &&
                  statusFilter === "all" &&
                  clientFilter === "all" && (
                    <Button
                      className="mt-4"
                      onClick={() => setNewNoteModalOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Note
                    </Button>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <NewNoteModal
        open={newNoteModalOpen}
        onOpenChange={setNewNoteModalOpen}
      />
      <ModalComponent />
    </Layout>
  );
};

export default Notes;
