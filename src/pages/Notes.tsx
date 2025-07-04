import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [editingNote, setEditingNote] = useState<Note | null>(null);

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
        "Client and partner attended couples session. Significant improvement noted in communication patterns since last session. Both parties are actively using 'I' statements and practicing active listening techniques learned in previous sessions. Conflict frequency has decreased from daily arguments to 2-3 times per week. Both report feeling more heard and understood.",
      goals:
        "Continue improving communication skills\nReduce conflict frequency to once per week or less\nIncrease quality time together",
      followUp:
        "Practice weekly check-ins\nImplement date night schedule\nContinue communication exercises",
    },
    {
      id: 3,
      clientName: "Sarah Johnson",
      title: "Crisis Intervention Session",
      date: "2024-01-20",
      type: "BIRP",
      status: "Reviewed",
      wordCount: 680,
      isStarred: true,
      diagnosis: "PTSD",
      content:
        "BEHAVIOR: Client presented in acute distress following a triggering event (car accident witness). Exhibited hypervigilance, rapid speech, and trembling. Reported flashbacks and intrusive thoughts.\n\nINTERVENTION: Implemented grounding techniques (5-4-3-2-1 method), deep breathing exercises, and progressive muscle relaxation. Reviewed safety plan and coping strategies. Provided psychoeducation about trauma responses.\n\nRESPONSE: Client was able to regulate breathing and reported decreased anxiety from 9/10 to 6/10 by session end. Demonstrated understanding of grounding techniques.\n\nPLAN: Increase session frequency temporarily. Review and update safety plan. Consider EMDR therapy options.",
      goals:
        "Stabilize acute symptoms\nImplement daily grounding techniques\nProcess trauma in safe therapeutic environment",
      followUp:
        "Daily check-in calls for one week\nSchedule session for tomorrow\nReview safety plan with support person",
    },
    {
      id: 4,
      clientName: "David Wilson",
      title: "Family Therapy Session #6",
      date: "2024-01-19",
      type: "DAP",
      status: "Complete",
      wordCount: 425,
      isStarred: false,
      diagnosis: "Family Dysfunction",
      content:
        "DATA: Family session with parents and teenage son (16). Focus on establishing boundaries and improving communication. Son participated more actively this session compared to previous sessions. Parents showed improved consistency in approach.\n\nASSESSMENT: Positive progress noted in family dynamics. Reduced conflict over household rules. Son demonstrating increased compliance with agreed-upon boundaries. Parents working more as a team.\n\nPLAN: Continue family sessions bi-weekly. Implement weekly family meetings at home. Review progress on behavioral contracts.",
      goals:
        "Establish clear family boundaries\nImprove parent-teen communication\nReduce family conflict episodes",
      followUp:
        "Implement weekly family meetings\nReview behavioral contract\nSchedule next session in two weeks",
    },
    {
      id: 5,
      clientName: "Lisa Rodriguez",
      title: "Treatment Plan Update",
      date: "2024-01-18",
      type: "Progress",
      status: "Draft",
      wordCount: 250,
      isStarred: false,
      diagnosis: "Major Depressive Disorder",
      content:
        "Treatment plan review following psychiatric consultation. Client has been on antidepressant medication for 6 weeks with some improvement in mood symptoms. PHQ-9 score decreased from 18 to 12. Sleep patterns improving. Still experiencing low motivation and energy levels.\n\nAdjusting therapy approach to include behavioral activation techniques. Adding mood tracking and activity scheduling to treatment plan.",
      goals:
        "Continue mood stabilization\nIncrease daily activities and social engagement\nImprove energy levels and motivation",
      followUp:
        "Begin mood tracking journal\nSchedule pleasant activities daily\nCoordinate with psychiatrist for medication follow-up",
    },
  ];

  // Load notes data on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
    if (statusFilter === "all") return true;
    return note.status.toLowerCase() === statusFilter;
  });

  const notesStats: NotesStats = {
    totalNotes: notes.length,
    completedNotes: notes.filter((n) => n.status === "Complete").length,
    draftNotes: notes.filter((n) => n.status === "Draft").length,
    starredNotes: notes.filter((n) => n.isStarred).length,
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Reviewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Action handlers with proper error handling
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

  const handleNoteAction = useCallback(
    (note: Note, action: string) => {
      switch (action) {
        case "view":
          showModal({
            type: "info",
            title: `Note Details - ${note.clientName}`,
            message: `Title: ${note.title}\nDate: ${new Date(note.date).toLocaleDateString()}\nType: ${note.type}\nStatus: ${note.status}\nWord Count: ${note.wordCount}\nDiagnosis: ${note.diagnosis}`,
            confirmLabel: "Close",
          });
          break;
        case "edit":
          setEditingNote(note);
          setNewNoteModalOpen(true);
          toast({
            title: "Edit Mode",
            description: `Opening "${note.title}" for editing.`,
          });
          break;
        case "star":
          setNotes((prev) =>
            prev.map((n) =>
              n.id === note.id ? { ...n, isStarred: !n.isStarred } : n,
            ),
          );
          toast({
            title: note.isStarred ? "Unstarred" : "Starred",
            description: `${note.title} ${note.isStarred ? "removed from" : "added to"} starred notes.`,
          });
          break;
        case "archive":
          setNotes((prev) =>
            prev.map((n) =>
              n.id === note.id ? { ...n, status: "Reviewed" as const } : n,
            ),
          );
          toast({
            title: "Note Archived",
            description: `${note.title} has been archived.`,
          });
          break;
      }
    },
    [showModal, toast],
  );

  const handleNoteModalClose = useCallback((open: boolean) => {
    setNewNoteModalOpen(open);
    if (!open) {
      setEditingNote(null);
    }
  }, []);

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
          <Button
            onClick={() => {
              setEditingNote(null);
              setNewNoteModalOpen(true);
            }}
            className="shrink-0"
            aria-label="Create new note"
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New Note
          </Button>
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
              <p className="text-xs text-muted-foreground">notes created</p>
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
                <TrendingUp
                  className="h-4 w-4 text-purple-600"
                  aria-hidden="true"
                />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {Math.round(
                  (notesStats.completedNotes / notesStats.totalNotes) * 100,
                )}
                %
              </div>
              <Progress
                value={Math.round(
                  (notesStats.completedNotes / notesStats.totalNotes) * 100,
                )}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Notes List */}
        <Card className="therapease-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Recent Notes</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                        Date & Type
                      </TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[100px] hidden md:table-cell">
                        Details
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
                              <Lock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {note.clientName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {note.diagnosis}
                            </div>
                            {/* Mobile-only date info */}
                            <div className="sm:hidden mt-1 text-xs text-muted-foreground">
                              {new Date(note.date).toLocaleDateString()} •{" "}
                              {note.type}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="text-sm">
                            <div className="font-medium">
                              {new Date(note.date).toLocaleDateString()}
                            </div>
                            <div className="text-muted-foreground">
                              {note.type}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge
                              className={getStatusColor(note.status)}
                              variant="outline"
                            >
                              {note.status}
                            </Badge>
                            {/* Mobile-only word count */}
                            <div className="md:hidden text-xs text-muted-foreground">
                              {note.wordCount} words
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">
                            <div className="font-medium">
                              {note.wordCount} words
                            </div>
                            <Badge
                              className={getTypeColor(note.type)}
                              variant="outline"
                              className="text-xs"
                            >
                              {note.type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleNoteAction(note, "star")}
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleNoteAction(note, "view")}
                              aria-label={`View details for ${note.title}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleNoteAction(note, "edit")}
                              aria-label={`Edit ${note.title}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
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
                  {statusFilter !== "all"
                    ? "Try changing the status filter to see more notes"
                    : "Create your first note to get started"}
                </p>
                {statusFilter === "all" && (
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setEditingNote(null);
                      setNewNoteModalOpen(true);
                    }}
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
        onOpenChange={handleNoteModalClose}
        editingNote={editingNote}
      />
      <ModalComponent />
    </Layout>
  );
};

export default Notes;
