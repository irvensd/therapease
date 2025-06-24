import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Plus,
  Search,
  Archive,
  Mic,
  MicOff,
  User,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  Lock,
  Bookmark,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Brain,
} from "lucide-react";
import { NewNoteModal } from "@/components/modals/NewNoteModal";

// Mock notes data
const mockNotes = [
  {
    id: 1,
    clientName: "Emma Thompson",
    clientId: "c1",
    sessionNumber: 12,
    date: "2024-11-22",
    time: "9:00 AM",
    duration: 60,
    noteType: "Session Note",
    template: "Individual Therapy Progress Note",
    status: "completed",
    isSecure: true,
    mood: "anxious",
    progressRating: 7,
    content: {
      presenting_concern: "Client continues to experience work-related anxiety, particularly around upcoming project deadlines and presentations.",
      session_focus: "Cognitive restructuring techniques for catastrophic thinking patterns related to work performance.",
      interventions: "1. Reviewed thought record from previous week\n2. Practiced cognitive reframing exercises\n3. Introduced progressive muscle relaxation technique",
      client_response: "Client demonstrated good understanding of cognitive distortions. Expressed feeling more confident after practicing reframing exercises during session.",
      homework_assigned: "1. Complete daily thought records for work-related anxiety\n2. Practice PMR technique 10 minutes daily\n3. Use reframing worksheet before important meetings",
      progress_toward_goals: "Goal 1 (Reduce anxiety symptoms): Showing steady improvement. Client reports 40% reduction in daily anxiety using breathing techniques.\nGoal 2 (Improve work confidence): Moderate progress. Beginning to challenge negative self-talk.",
      risk_assessment: "No current safety concerns identified. Client appears stable and engaged.",
      next_session_plan: "Review homework completion, continue CBT techniques, introduce mindfulness strategies if appropriate."
    },
    tags: ["anxiety", "cognitive-behavioral", "work-stress"],
    wordCount: 156,
    lastModified: "2024-11-22 10:30 AM"
  },
  {
    id: 2,
    clientName: "Michael Chen",
    clientId: "c2",
    sessionNumber: 8,
    date: "2024-11-22",
    time: "10:30 AM",
    duration: 90,
    noteType: "Couples Session Note",
    template: "Couples Therapy Progress Note",
    status: "completed",
    isSecure: true,
    mood: "tense",
    progressRating: 6,
    content: {
      presenting_concern: "Couple continues to struggle with communication patterns, particularly around household responsibilities and parenting decisions.",
      session_focus: "Active listening skills and 'I' statement practice. Addressing recurring conflict about childcare duties.",
      interventions: "1. Gottman's Speaker-Listener technique practice\n2. Role-played recent conflict about school pickup\n3. Explored underlying needs and emotions",
      client_response: "Both partners engaged well in exercises. Wife showed particular improvement in listening without interrupting. Husband struggled initially but made progress by session end.",
      homework_assigned: "1. Practice Speaker-Listener technique 15 minutes daily\n2. Schedule weekly check-ins about household tasks\n3. Each partner to complete 'Emotional Needs' worksheet",
      progress_toward_goals: "Goal 1 (Improve communication): Good progress. Less interrupting observed during session.\nGoal 2 (Reduce conflict frequency): Some improvement. Couple reports only 2 major conflicts this week vs previous 4-5.",
      risk_assessment: "No safety concerns. Relationship stress present but manageable. No signs of domestic violence.",
      next_session_plan: "Review homework exercises, introduce conflict resolution skills, address parenting consistency."
    },
    tags: ["couples-therapy", "communication", "parenting"],
    wordCount: 178,
    lastModified: "2024-11-22 12:00 PM"
  },
  {
    id: 3,
    clientName: "Sarah Johnson",
    clientId: "c3",
    sessionNumber: 15,
    date: "2024-11-21",
    time: "1:00 PM",
    duration: 60,
    noteType: "Treatment Plan Review",
    template: "Treatment Plan Progress Review",
    status: "completed",
    isSecure: true,
    mood: "hopeful",
    progressRating: 8,
    content: {
      presenting_concern: "Quarterly review of treatment progress for depression and self-esteem issues. Client initially presented with major depressive episode.",
      session_focus: "Comprehensive review of treatment goals, assessment of current symptoms, and planning for next phase of treatment.",
      interventions: "1. Administered PHQ-9 depression screening\n2. Reviewed progress on all treatment goals\n3. Discussed maintenance strategies and relapse prevention",
      client_response: "Client reports significant improvement in mood and daily functioning. PHQ-9 score decreased from 18 (initial) to 6 (current). Expressing optimism about future.",
      homework_assigned: "1. Continue current coping strategies\n2. Begin tapering frequency of sessions to bi-weekly\n3. Complete self-advocacy goal-setting worksheet",
      progress_toward_goals: "Goal 1 (Reduce depressive symptoms): Excellent progress. Symptoms now in mild range.\nGoal 2 (Improve self-esteem): Good progress. Using positive self-talk regularly.\nGoal 3 (Increase social activities): Met. Joined book club and yoga class.",
      risk_assessment: "Significant improvement in overall functioning. No current suicidal ideation. Strong support system in place.",
      next_session_plan: "Transition to maintenance phase. Focus on relapse prevention and long-term wellness strategies."
    },
    tags: ["depression", "treatment-review", "progress-assessment"],
    wordCount: 189,
    lastModified: "2024-11-21 2:15 PM"
  },
  {
    id: 4,
    clientName: "David Wilson",
    clientId: "c4",
    sessionNumber: 5,
    date: "2024-11-21",
    time: "2:30 PM",
    duration: 75,
    noteType: "Family Session Note",
    template: "Family Therapy Session Note",
    status: "completed",
    isSecure: true,
    mood: "frustrated",
    progressRating: 5,
    content: {
      presenting_concern: "Family session addressing 16-year-old son's behavioral issues including defiance, curfew violations, and declining academic performance.",
      session_focus: "Family communication patterns, boundary setting, and consequences for teenage behavior. Both parents and teen present.",
      interventions: "1. Family mapping exercise to identify roles and dynamics\n2. Problem-solving training around curfew issues\n3. Discussed age-appropriate consequences and privileges",
      client_response: "Parents engaged and motivated. Teen initially resistant but participated more actively after expressing his perspective was heard. Some defensive behaviors noted.",
      homework_assigned: "1. Family to practice weekly check-in meetings\n2. Parents to agree on consistent consequences before implementing\n3. Teen to propose his own accountability plan",
      progress_toward_goals: "Goal 1 (Improve family communication): Limited progress. Still significant tension.\nGoal 2 (Establish clear boundaries): Some progress. Parents more aligned on rules.\nGoal 3 (Reduce behavioral incidents): Minimal change observed.",
      risk_assessment: "No immediate safety concerns. Family stress elevated but manageable. Teen appears frustrated but not at-risk.",
      next_session_plan: "Individual session with teen next week, then return to family format. Address underlying emotional needs."
    },
    tags: ["family-therapy", "adolescent", "behavioral-issues"],
    wordCount: 198,
    lastModified: "2024-11-21 4:00 PM"
  },
  {
    id: 5,
    clientName: "Lisa Park",
    clientId: "c5",
    sessionNumber: 22,
    date: "2024-11-20",
    time: "4:00 PM",
    duration: 60,
    noteType: "EMDR Session Note",
    template: "EMDR Treatment Session Note",
    status: "completed",
    isSecure: true,
    mood: "calm",
    progressRating: 9,
    content: {
      presenting_concern: "EMDR session targeting specific traumatic memory from motor vehicle accident 2 years ago. Client continues PTSD treatment.",
      session_focus: "Processing target memory using EMDR protocol. Memory: 'Moment of impact during car accident.'",
      interventions: "1. Resource installation (safe place, calm/confident resources)\n2. Target memory processing - 6 sets of bilateral stimulation\n3. Installation of positive cognition: 'I survived and I am safe now'",
      client_response: "Excellent processing session. Client reported significant reduction in emotional intensity (SUD: 8 → 2). Physical sensations cleared. No blocking beliefs identified.",
      homework_assigned: "1. Continue daily grounding exercises\n2. Use installed resources if triggered\n3. Complete PTSD symptom tracking log",
      progress_toward_goals: "Goal 1 (Process trauma): Excellent progress. Target memory now minimally distressing.\nGoal 2 (Reduce PTSD symptoms): Very good progress. Nightmares decreased from nightly to 1-2 per week.\nGoal 3 (Return to driving): Significant progress. Client drove to session today.",
      risk_assessment: "Stable and improving. Strong coping resources. No safety concerns identified.",
      next_session_plan: "Check processing of current target, assess for additional memories needing processing."
    },
    tags: ["emdr", "ptsd", "trauma-processing"],
    wordCount: 167,
    lastModified: "2024-11-20 5:30 PM"
  },
  {
    id: 6,
    clientName: "Robert Martinez",
    clientId: "c6",
    sessionNumber: 1,
    date: "2024-11-19",
    time: "11:00 AM",
    duration: 90,
    noteType: "Intake Assessment",
    template: "Initial Clinical Assessment",
    status: "completed",
    isSecure: true,
    mood: "apprehensive",
    progressRating: null,
    content: {
      presenting_concern: "New client self-referred for anxiety and depression following job loss 3 months ago. Reports increased alcohol use and social isolation.",
      session_focus: "Comprehensive intake assessment including mental health history, current symptoms, risk factors, and treatment planning.",
      interventions: "1. Clinical interview and psychosocial history\n2. Administered GAD-7, PHQ-9, and AUDIT assessments\n3. Risk assessment and safety planning",
      client_response: "Client cooperative and forthcoming. Demonstrated insight into connection between job loss and current symptoms. Motivated for treatment.",
      homework_assigned: "1. Complete intake paperwork and release forms\n2. Begin daily mood tracking\n3. Schedule appointment with primary physician for physical exam",
      progress_toward_goals: "Initial session - treatment goals to be established: 1. Reduce anxiety and depression symptoms 2. Develop healthy coping strategies 3. Address alcohol use concerns",
      risk_assessment: "Mild suicide ideation without plan or intent. Increased alcohol use but not meeting criteria for dependence. Support system limited but present.",
      next_session_plan: "Review intake materials, finalize treatment plan, begin psychoeducation about anxiety and depression."
    },
    tags: ["intake", "assessment", "anxiety", "depression", "alcohol-use"],
    wordCount: 201,
    lastModified: "2024-11-19 12:45 PM"
  }
];

// HIPAA-compliant note templates
const noteTemplates = [
  {
    id: "individual-progress",
    name: "Individual Therapy Progress Note",
    category: "Standard Sessions",
    description: "Comprehensive session note for individual therapy",
    fields: [
      "presenting_concern",
      "session_focus", 
      "interventions",
      "client_response",
      "homework_assigned",
      "progress_toward_goals",
      "risk_assessment",
      "next_session_plan"
    ],
    isHIPAACompliant: true
  },
  {
    id: "couples-progress",
    name: "Couples Therapy Progress Note",
    category: "Couples/Family",
    description: "Session note template for couples therapy",
    fields: [
      "presenting_concern",
      "session_focus",
      "interventions", 
      "client_response",
      "homework_assigned",
      "progress_toward_goals",
      "risk_assessment",
      "next_session_plan"
    ],
    isHIPAACompliant: true
  },
  {
    id: "intake-assessment",
    name: "Initial Clinical Assessment",
    category: "Assessments",
    description: "Comprehensive intake and assessment template",
    fields: [
      "presenting_concern",
      "clinical_history",
      "mental_status_exam",
      "risk_assessment",
      "diagnostic_impressions",
      "treatment_recommendations",
      "next_session_plan"
    ],
    isHIPAACompliant: true
  },
  {
    id: "treatment-plan-review",
    name: "Treatment Plan Progress Review",
    category: "Assessments", 
    description: "Quarterly treatment plan review template",
    fields: [
      "treatment_period_reviewed",
      "progress_summary",
      "goal_achievements",
      "barriers_to_progress",
      "plan_modifications",
      "next_phase_planning"
    ],
    isHIPAACompliant: true
  },
  {
    id: "crisis-intervention",
    name: "Crisis Intervention Note",
    category: "Crisis/Safety",
    description: "Emergency session and crisis intervention documentation",
    fields: [
      "crisis_situation",
      "risk_assessment_detailed",
      "interventions_implemented",
      "safety_plan_created",
      "referrals_made",
      "follow_up_plan"
    ],
    isHIPAACompliant: true
  }
];

const Notes = () => {
  const [newNoteModalOpen, setNewNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClient, setFilterClient] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Filter notes based on search and filters
  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = note.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.presenting_concern.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClient = filterClient === "all" || note.clientName === filterClient;
    const matchesType = filterType === "all" || note.noteType === filterType;
    const matchesStatus = filterStatus === "all" || note.status === filterStatus;
    
    return matchesSearch && matchesClient && matchesType && matchesStatus;
  });

  // Get unique clients for filter
  const uniqueClients = [...new Set(mockNotes.map(note => note.clientName))];
  const uniqueTypes = [...new Set(mockNotes.map(note => note.noteType))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "draft": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "review": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy": return "text-green-600";
      case "calm": return "text-blue-600";
      case "anxious": return "text-yellow-600";
      case "sad": return "text-purple-600";
      case "angry": return "text-red-600";
      case "frustrated": return "text-orange-600";
      case "hopeful": return "text-emerald-600";
      case "tense": return "text-rose-600";
      default: return "text-gray-600";
    }
  };

  const handleVoiceToggle = () => {
    setIsVoiceRecording(!isVoiceRecording);
    if (!isVoiceRecording) {
      // Start voice recording
      console.log("Starting voice recording...");
      // In a real app, this would integrate with Web Speech API
    } else {
      // Stop voice recording
      console.log("Stopping voice recording...");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate statistics
  const totalNotes = mockNotes.length;
  const notesThisWeek = mockNotes.filter(note => {
    const noteDate = new Date(note.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return noteDate >= weekAgo;
  }).length;
  const avgProgressRating = mockNotes
    .filter(note => note.progressRating !== null)
    .reduce((sum, note) => sum + note.progressRating!, 0) / 
    mockNotes.filter(note => note.progressRating !== null).length;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Session Notes</h1>
            <p className="text-muted-foreground">
              HIPAA-compliant documentation with intelligent templates and voice integration
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Brain className="mr-2 h-4 w-4" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>HIPAA-Compliant Note Templates</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  {noteTemplates.map((template) => (
                    <Card key={template.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{template.category}</Badge>
                          {template.isHIPAACompliant && (
                            <Badge className="bg-green-100 text-green-800">
                              <Lock className="mr-1 h-3 w-3" />
                              HIPAA Compliant
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.fields.map((field) => (
                          <Badge key={field} variant="secondary" className="text-xs">
                            {field.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={() => setNewNoteModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Notes</p>
                  <p className="text-2xl font-bold">{totalNotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">{notesThisWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                  <p className="text-2xl font-bold">{avgProgressRating.toFixed(1)}/10</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Lock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Secure Notes</p>
                  <p className="text-2xl font-bold">{mockNotes.filter(n => n.isSecure).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search notes by client, content, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterClient} onValueChange={setFilterClient}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {uniqueClients.map(client => (
                    <SelectItem key={client} value={client}>{client}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quick Note Creation with Voice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Quick Note Creation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select HIPAA template" />
                  </SelectTrigger>
                  <SelectContent>
                    {noteTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant={isVoiceRecording ? "destructive" : "outline"}
                  onClick={handleVoiceToggle}
                  className="flex items-center gap-2"
                >
                  {isVoiceRecording ? (
                    <>
                      <MicOff className="h-4 w-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Voice to Text
                    </>
                  )}
                </Button>
              </div>
              {isVoiceRecording && (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-sm">Recording... Speak clearly for voice-to-text transcription</span>
                </div>
              )}
              <Textarea
                placeholder="Start typing your note or use voice-to-text..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {newNoteContent.length} characters • Auto-saved • HIPAA Encrypted
                </p>
                <Button disabled={!newNoteContent.trim()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Note
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{note.clientName}</h3>
                      <Badge className={getStatusColor(note.status)}>
                        {note.status}
                      </Badge>
                      <Badge variant="outline">
                        Session #{note.sessionNumber}
                      </Badge>
                      {note.isSecure && (
                        <Badge className="bg-green-100 text-green-800">
                          <Lock className="mr-1 h-3 w-3" />
                          Encrypted
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(note.date)} • {note.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {note.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {note.noteType}
                      </span>
                      {note.mood && (
                        <span className={`flex items-center gap-1 ${getMoodColor(note.mood)}`}>
                          <User className="h-3 w-3" />
                          {note.mood}
                        </span>
                      )}
                      {note.progressRating && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <TrendingUp className="h-3 w-3" />
                          Progress: {note.progressRating}/10
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {note.content.presenting_concern}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{note.wordCount} words</p>
                      <p>Modified: {note.lastModified}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedNote(note)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notes found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or create a new note.
              </p>
              <Button onClick={() => setNewNoteModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Note
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Note Detail Modal */}
        {selectedNote && (
          <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
            <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedNote.clientName} - Session #{selectedNote.sessionNumber}
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatDate(selectedNote.date)} • {selectedNote.time}</span>
                  <Badge className={getStatusColor(selectedNote.status)}>
                    {selectedNote.status}
                  </Badge>
                  {selectedNote.isSecure && (
                    <Badge className="bg-green-100 text-green-800">
                      <Lock className="mr-1 h-3 w-3" />
                      HIPAA Encrypted
                    </Badge>
                  )}
                </div>
              </DialogHeader>
              <div className="space-y-6">
                {Object.entries(selectedNote.content).map(([field, content]) => (
                  <div key={field}>
                    <h4 className="font-semibold mb-2 capitalize">
                      {field.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-lg">
                      {content as string}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <p>Last modified: {selectedNote.lastModified}</p>
                    <p>Word count: {selectedNote.wordCount}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <NewNoteModal
        open={newNoteModalOpen}
        onOpenChange={setNewNoteModalOpen}
      />
    </Layout>
  );
};

export default Notes;
