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
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Session Notes</h1>
            <p className="text-muted-foreground">
              Create, manage, and organize your therapy session notes
            </p>
          </div>
          <Button onClick={() => setNewNoteModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Digital Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create structured notes with templates and tags
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setNewNoteModalOpen(true)}
              >
                Create Note
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5 text-primary" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Quickly find notes by client, date, or content
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  alert(
                    "Advanced search coming soon! You'll be able to search by client name, date range, keywords, and treatment goals.",
                  );
                }}
              >
                Search Notes
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Archive className="mr-2 h-5 w-5 text-primary" />
                Archive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Secure storage for completed treatment notes
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  alert(
                    "Secure archive coming soon! All notes will be encrypted and stored with full HIPAA compliance for long-term retention.",
                  );
                }}
              >
                View Archive
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="therapease-card">
          <CardHeader>
            <CardTitle>Features in Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>HIPAA-compliant note templates</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Voice-to-text integration</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Automatic client linking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Treatment progress tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Encrypted cloud backup</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <NewNoteModal
        open={newNoteModalOpen}
        onOpenChange={setNewNoteModalOpen}
      />
    </Layout>
  );
};

export default Notes;
