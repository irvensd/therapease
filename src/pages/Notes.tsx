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
