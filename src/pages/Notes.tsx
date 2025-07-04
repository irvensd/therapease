import { useState, useMemo, useCallback } from "react";
import Layout from "@/components/Layout";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
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
  Eye,
  Edit,
  Star,
  StarOff,
  Lock,
  Users,
  CheckCircle,
  Calendar,
  MoreVertical,
  Trash2,
  Download,
  Filter,
  Mic,
} from "lucide-react";
import { NewNoteModal } from "@/components/modals/NewNoteModal";

// Enhanced Note interface
interface Note {
  id: number;
  title: string;
  clientName: string;
  sessionDate: string;
  createdAt: string;
  type: "SOAP" | "DAP" | "BIRP" | "Progress" | "Assessment" | "Treatment Plan";
  status: "Draft" | "Complete" | "Reviewed" | "Archived";
  tags: string[];
  wordCount: number;
  content: string;
  isStarred: boolean;
  isConfidential: boolean;
  sessionDuration: number;
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
  const [newNoteModalOpen, setNewNoteModalOpen] = useState(false);

  // Static mock data to avoid any computation issues
  const mockNotes: SimpleNote[] = [
    {
      id: 1,
      title: "Initial Assessment - Anxiety Treatment",
      clientName: "Emma Thompson",
      date: "2024-01-22",
      type: "SOAP",
      status: "Complete",
      isStarred: true,
    },
    {
      id: 2,
      title: "Progress Review - Week 4",
      clientName: "Michael Chen",
      date: "2024-01-21",
      type: "Progress",
      status: "Complete",
      isStarred: false,
    },
    {
      id: 3,
      title: "Crisis Intervention Session",
      clientName: "Sarah Johnson",
      date: "2024-01-20",
      type: "BIRP",
      status: "Draft",
      isStarred: true,
    },
  ];

  const handleViewNote = (note: SimpleNote) => {
    toast({
      title: "View Note",
      description: `Viewing "${note.title}" by ${note.clientName}`,
    });
  };

  const handleEditNote = (note: SimpleNote) => {
    toast({
      title: "Edit Note",
      description: `Edit functionality for "${note.title}" coming soon!`,
    });
  };

  const handleToggleStar = (noteId: number) => {
    toast({
      title: "Star Toggle",
      description: "Star functionality working!",
    });
  };

  const getStatusColor = (status: string) => {
    return status === "Complete"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "SOAP":
        return "bg-purple-100 text-purple-800";
      case "BIRP":
        return "bg-green-100 text-green-800";
      case "Progress":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Session Notes</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Create, manage, and organize your therapy session notes
            </p>
          </div>
          <Button
            onClick={() => setNewNoteModalOpen(true)}
            className="shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Total Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {mockNotes.length}
              </div>
              <p className="text-xs text-muted-foreground">notes created</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {mockNotes.filter((n) => n.status === "Complete").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {mockNotes.filter((n) => n.status === "Draft").length} drafts
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                Starred
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {mockNotes.filter((n) => n.isStarred).length}
              </div>
              <p className="text-xs text-muted-foreground">important notes</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Recent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {mockNotes.length}
              </div>
              <p className="text-xs text-muted-foreground">this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Create Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Start a new session note with templates
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setNewNoteModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Search Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Find notes by client, date, or content
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  toast({
                    title: "Search",
                    description: "Search functionality coming soon!",
                  })
                }
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-primary" />
                Archive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Secure storage for completed notes
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  toast({
                    title: "Archive",
                    description: "Archive functionality coming soon!",
                  })
                }
              >
                <Archive className="mr-2 h-4 w-4" />
                View Archive
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Notes List */}
        <Card className="therapease-card">
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{note.title}</h3>
                      {note.isStarred && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                      <Lock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {note.clientName} •{" "}
                      {new Date(note.date).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
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
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStar(note.id)}
                    >
                      {note.isStarred ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewNote(note)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditNote(note)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {mockNotes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-medium">
                  No notes found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first session note to get started
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setNewNoteModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Note
                </Button>
              </div>
            )}
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
