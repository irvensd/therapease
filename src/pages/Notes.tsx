import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  FileText,
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
  Star,
  StarOff,
  Lock,
  Archive,
  Calendar,
  Download,
  Search,
  Mic,
  MicOff,
  User,
  Trash2,
  Filter,
  Bookmark,
  AlertTriangle,
  Target,
  Brain,
} from "lucide-react";
import { NewNoteModal } from "@/components/modals/NewNoteModal";

// Types for better type safety
interface Note {
  id: number;
  clientName: string;
  title: string;
  date: string;
  type: "SOAP" | "DAP" | "BIRP" | "Progress";
  status: "Draft" | "Complete" | "Reviewed";
  wordCount: number;
  isStarred: boolean;
  diagnosis: string;
  content: string;
  goals: string;
  followUp: string;
}

interface NotesStats {
  totalNotes: number;
  completedNotes: number;
  draftNotes: number;
  starredNotes: number;
}

// Enhanced note interface for editing
interface EditingNote {
  id: number;
  clientName: string;
  title: string;
  content: string;
  goals: string;
  followUp: string;
  type: "SOAP" | "DAP" | "BIRP" | "Progress";
  diagnosis: string;
}

const Notes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showModal, ModalComponent } = useConfirmationModal();

  // State management
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNoteModalOpen, setNewNoteModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingNote, setEditingNote] = useState<EditingNote | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock notes data - in real app would be fetched from API
  const mockNotes: Note[] = [
    {
      id: 1,
      clientName: "Emma Thompson",
      title: "Initial Assessment - Anxiety Treatment",
      date: "2024-01-22",
      type: "SOAP",
      status: "Complete",
      wordCount: 485,
      isStarred: true,
      diagnosis: "Generalized Anxiety Disorder",
      content:
        "SUBJECTIVE: Client reports increased anxiety levels over the past month, particularly related to work presentations. Experiencing difficulty sleeping (4-5 hours per night) and concentrating during meetings. States anxiety level at 8/10 on average.\n\nOBJECTIVE: Client appeared anxious but engaged throughout the session. Fidgeting observed. Speech was clear and goal-directed. No signs of psychomotor agitation.\n\nASSESSMENT: Symptoms consistent with Generalized Anxiety Disorder. Client is motivated for treatment and shows good insight into triggers.\n\nPLAN: Begin CBT techniques focusing on cognitive restructuring. Introduce breathing exercises and progressive muscle relaxation. Schedule weekly sessions.",
      goals:
        "1. Reduce anxiety symptoms from 8/10 to 4/10 within 8 weeks\n2. Improve sleep quality to 7+ hours per night\n3. Develop effective coping strategies for work presentations",
      followUp:
        "Practice breathing exercises daily\nComplete thought record worksheet\nSchedule follow-up appointment next week",
    },
    {
      id: 2,
      clientName: "Michael Chen",
      title: "Progress Review - Week 4",
      date: "2024-01-21",
      type: "Progress",
      status: "Complete",
      wordCount: 320,
      isStarred: false,
      diagnosis: "Relationship Issues",
      content:
        "Client continues to show improvement in communication with partner. Reports using 'I' statements effectively in recent conversations. Conflict frequency has decreased from daily to 2-3 times per week. Client demonstrates good understanding of active listening techniques.",
      goals:
        "1. Continue improving communication skills\n2. Reduce conflict frequency to once per week\n3. Practice expressing needs assertively",
      followUp:
        "Complete communication exercises with partner\nJournal daily interactions\nNext session in 1 week",
    },
    {
      id: 3,
      clientName: "Sarah Johnson",
      title: "Session 8 - Trauma Processing",
      date: "2024-01-20",
      type: "BIRP",
      status: "Draft",
      wordCount: 210,
      isStarred: true,
      diagnosis: "Post-Traumatic Stress Disorder",
      content:
        "BEHAVIOR: Client was able to discuss traumatic event for 15 minutes without dissociating. Showed appropriate emotional responses.\n\nINTERVENTION: Used grounding techniques and bilateral stimulation. Processed specific memory fragments.\n\nRESPONSE: Client remained present throughout session. Reported feeling 'lighter' after processing.\n\nPLAN: Continue EMDR protocol. Schedule next session for trauma processing.",
      goals:
        "1. Process traumatic memories safely\n2. Reduce PTSD symptoms\n3. Improve daily functioning",
      followUp:
        "Practice grounding exercises\nUse self-care techniques daily\nContact if flashbacks increase",
    },
    {
      id: 4,
      clientName: "David Wilson",
      title: "Family Session - Behavioral Intervention",
      date: "2024-01-19",
      type: "DAP",
      status: "Complete",
      wordCount: 380,
      isStarred: false,
      diagnosis: "Oppositional Defiant Disorder",
      content:
        "DATA: Teen exhibited 3 episodes of defiant behavior during session. Parents demonstrated improved consistency in response.\n\nASSESSMENT: Family is showing progress in implementing behavioral strategies. Teen's opposition decreased by 40% since last month.\n\nPLAN: Continue family therapy sessions. Implement token economy system at home.",
      goals:
        "1. Reduce oppositional behaviors by 50%\n2. Improve family communication\n3. Establish consistent household rules",
      followUp:
        "Implement token system\nFamily meeting weekly\nNext session in 2 weeks",
    },
    {
      id: 5,
      clientName: "Lisa Park",
      title: "Crisis Intervention - Session Notes",
      date: "2024-01-18",
      type: "SOAP",
      status: "Reviewed",
      wordCount: 445,
      isStarred: true,
      diagnosis: "Major Depressive Disorder",
      content:
        "SUBJECTIVE: Client presented in acute distress following job loss. Reports suicidal ideation but denies intent or plan. Support system identified (sister, close friend).\n\nOBJECTIVE: Client appeared tearful but cooperative. Good eye contact maintained. Speech normal rate and volume.\n\nASSESSMENT: Acute stress reaction to job loss. Depression symptoms exacerbated. Safety contract established.\n\nPLAN: Increased session frequency to weekly. Safety planning completed. Referral for psychiatric evaluation.",
      goals:
        "1. Maintain safety and reduce suicidal ideation\n2. Develop coping strategies for job loss\n3. Stabilize mood symptoms",
      followUp:
        "Daily check-ins with support person\nSafety contract in place\nPsychiatry appointment scheduled",
    },
  ];

  // Initialize notes data
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        setNotes(mockNotes);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load notes. Please try again.");
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Calculate statistics
  const stats = useMemo((): NotesStats => {
    const total = notes.length;
    const completed = notes.filter((note) => note.status === "Complete").length;
    const draft = notes.filter((note) => note.status === "Draft").length;
    const starred = notes.filter((note) => note.isStarred).length;

    return {
      totalNotes: total,
      completedNotes: completed,
      draftNotes: draft,
      starredNotes: starred,
    };
  }, [notes]);

  // Filter notes based on search and filters
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || note.status === statusFilter;

      const today = new Date();
      const noteDate = new Date(note.date);
      let matchesPeriod = true;

      if (selectedPeriod === "today") {
        matchesPeriod = noteDate.toDateString() === today.toDateString();
      } else if (selectedPeriod === "week") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesPeriod = noteDate >= weekAgo;
      } else if (selectedPeriod === "month") {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesPeriod = noteDate >= monthAgo;
      }

      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [notes, searchTerm, statusFilter, selectedPeriod]);

  // Handle note actions
  const handleEditNote = useCallback((note: Note) => {
    const editingData: EditingNote = {
      id: note.id,
      clientName: note.clientName,
      title: note.title,
      content: note.content,
      goals: note.goals,
      followUp: note.followUp,
      type: note.type,
      diagnosis: note.diagnosis,
    };

    setEditingNote(editingData);
    setNewNoteModalOpen(true);
  }, []);

  const handleDeleteNote = useCallback(
    (note: Note) => {
      showModal({
        type: "destructive",
        title: "Delete Note",
        message: `Are you sure you want to delete the note "${note.title}" for ${note.clientName}? This action cannot be undone.`,
        confirmLabel: "Delete Note",
        cancelLabel: "Cancel",
        showCancel: true,
        onConfirm: () => {
          setNotes((prev) => prev.filter((n) => n.id !== note.id));
          toast({
            title: "Note Deleted",
            description: `Note "${note.title}" has been permanently deleted.`,
          });
        },
      });
    },
    [showModal, toast],
  );

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
          description: `Note "${note.title}" ${note.isStarred ? "removed from" : "added to"} starred notes.`,
        });
      }
    },
    [notes, toast],
  );

  const handleExportNotes = useCallback(() => {
    try {
      const csvHeaders = [
        "Date",
        "Client Name",
        "Title",
        "Type",
        "Status",
        "Diagnosis",
        "Word Count",
        "Content",
        "Goals",
        "Follow Up",
        "Starred",
      ];

      const csvData = filteredNotes.map((note) => [
        note.date,
        note.clientName,
        note.title,
        note.type,
        note.status,
        note.diagnosis,
        note.wordCount.toString(),
        `"${note.content.replace(/"/g, '""')}"`,
        `"${note.goals.replace(/"/g, '""')}"`,
        `"${note.followUp.replace(/"/g, '""')}"`,
        note.isStarred ? "Yes" : "No",
      ]);

      const csvContent = [csvHeaders, ...csvData]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `therapy-notes-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${filteredNotes.length} notes exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting notes. Please try again.",
        variant: "destructive",
      });
    }
  }, [filteredNotes, toast]);

  const getStatusColor = (status: Note["status"]) => {
    switch (status) {
      case "Complete":
        return "default";
      case "Draft":
        return "secondary";
      case "Reviewed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: Note["status"]) => {
    switch (status) {
      case "Complete":
        return <CheckCircle className="h-3 w-3" />;
      case "Draft":
        return <Clock className="h-3 w-3" />;
      case "Reviewed":
        return <Eye className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading notes...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8" />
              Clinical Notes
            </h1>
            <p className="text-muted-foreground">
              Manage session notes and clinical documentation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportNotes}
              disabled={filteredNotes.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export ({filteredNotes.length})
            </Button>
            <Button onClick={() => setNewNoteModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNotes}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedNotes}</div>
              <p className="text-xs text-muted-foreground">Finalized notes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draftNotes}</div>
              <p className="text-xs text-muted-foreground">
                Pending completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Starred</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.starredNotes}</div>
              <p className="text-xs text-muted-foreground">Important notes</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Note Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notes, clients, or content..."
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
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Clinical Notes ({filteredNotes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client & Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Words</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium flex items-center gap-2">
                            {note.isStarred && (
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            )}
                            {note.clientName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {note.title}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {note.diagnosis}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(note.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{note.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusColor(note.status)}
                          className="flex items-center gap-1 w-fit"
                        >
                          {getStatusIcon(note.status)}
                          {note.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{note.wordCount}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStar(note.id)}
                          >
                            {note.isStarred ? (
                              <StarOff className="h-4 w-4" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditNote(note)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredNotes.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try adjusting your search or filters"
                      : "Create your first clinical note to get started"}
                  </p>
                  <Button onClick={() => setNewNoteModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Note
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        <NewNoteModal
          open={newNoteModalOpen}
          onOpenChange={setNewNoteModalOpen}
          editingNote={editingNote}
        />
        <ModalComponent />
      </div>
    </Layout>
  );
};

export default Notes;
