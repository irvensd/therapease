import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Target,
  Plus,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  Calendar,
  Star,
  Award,
  Brain,
  Heart,
  Zap,
  Filter,
  Search,
  MoreVertical,
  FileText,
  BarChart3,
  RefreshCw,
} from "lucide-react";

// Types for progress tracking
interface TreatmentGoal {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  category: "Symptom" | "Functional" | "Behavioral" | "Cognitive" | "Social";
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Completed" | "On Hold" | "Discontinued";
  targetDate: string;
  createdDate: string;
  currentProgress: number; // 0-100
  measurableOutcome: string;
  interventions: string[];
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  completedDate?: string;
  notes?: string;
}

interface Assessment {
  id: string;
  clientId: string;
  clientName: string;
  assessmentType: string;
  scale: string;
  score: number;
  maxScore: number;
  dateAdministered: string;
  administeredBy: string;
  notes?: string;
  severity: "Minimal" | "Mild" | "Moderate" | "Severe" | "Extremely Severe";
}

interface ProgressData {
  date: string;
  score: number;
  sessionNumber: number;
  notes?: string;
}

interface ClientProgress {
  clientId: string;
  clientName: string;
  diagnosis: string;
  treatmentStartDate: string;
  totalSessions: number;
  activeGoals: number;
  completedGoals: number;
  averageProgress: number;
  lastAssessment: Assessment;
  progressData: ProgressData[];
}

const Progress = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showModal, ModalComponent } = useConfirmationModal();

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [selectedGoal, setSelectedGoal] = useState<TreatmentGoal | null>(null);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [progressDetailModalOpen, setProgressDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Goal form state
  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    category: "Symptom" as TreatmentGoal["category"],
    priority: "Medium" as TreatmentGoal["priority"],
    targetDate: "",
    measurableOutcome: "",
    interventions: "",
    clientId: "",
  });

  // Mock data
  const [treatmentGoals, setTreatmentGoals] = useState<TreatmentGoal[]>([
    {
      id: "g1",
      clientId: "c1",
      clientName: "Emma Thompson",
      title: "Reduce Anxiety Symptoms",
      description:
        "Decrease overall anxiety levels and improve daily functioning",
      category: "Symptom",
      priority: "High",
      status: "Active",
      targetDate: "2024-03-15",
      createdDate: "2024-01-15",
      currentProgress: 75,
      measurableOutcome: "GAD-7 score reduction from 18 to below 8",
      interventions: ["CBT", "Breathing exercises", "Exposure therapy"],
      milestones: [
        {
          id: "m1",
          title: "Learn breathing techniques",
          description: "Master diaphragmatic breathing and 4-7-8 technique",
          targetDate: "2024-02-01",
          completed: true,
          completedDate: "2024-01-28",
          notes: "Client demonstrates excellent technique",
        },
        {
          id: "m2",
          title: "Complete thought records",
          description:
            "Use thought record worksheets for cognitive restructuring",
          targetDate: "2024-02-15",
          completed: true,
          completedDate: "2024-02-12",
          notes: "Shows good understanding of thought patterns",
        },
        {
          id: "m3",
          title: "Exposure hierarchy completion",
          description: "Complete graduated exposure to anxiety triggers",
          targetDate: "2024-03-01",
          completed: false,
          notes: "In progress - currently at level 5 of 8",
        },
      ],
    },
    {
      id: "g2",
      clientId: "c1",
      clientName: "Emma Thompson",
      title: "Improve Sleep Quality",
      description: "Establish healthy sleep patterns and reduce insomnia",
      category: "Functional",
      priority: "Medium",
      status: "Active",
      targetDate: "2024-02-28",
      createdDate: "2024-01-20",
      currentProgress: 60,
      measurableOutcome:
        "Sleep 7+ hours nightly, fall asleep within 30 minutes",
      interventions: ["Sleep hygiene", "Relaxation techniques", "CBT-I"],
      milestones: [
        {
          id: "m4",
          title: "Establish bedtime routine",
          description: "Develop consistent pre-sleep routine",
          targetDate: "2024-02-01",
          completed: true,
          completedDate: "2024-01-30",
        },
        {
          id: "m5",
          title: "Reduce screen time before bed",
          description: "No screens 1 hour before bedtime",
          targetDate: "2024-02-10",
          completed: false,
        },
      ],
    },
    {
      id: "g3",
      clientId: "c2",
      clientName: "Michael Chen",
      title: "Improve Communication Skills",
      description: "Enhance relationship communication and conflict resolution",
      category: "Social",
      priority: "High",
      status: "Active",
      targetDate: "2024-04-01",
      createdDate: "2024-01-10",
      currentProgress: 45,
      measurableOutcome: "Use 'I' statements 80% of the time during conflicts",
      interventions: [
        "Communication training",
        "Active listening practice",
        "Conflict resolution techniques",
      ],
      milestones: [
        {
          id: "m6",
          title: "Learn active listening",
          description: "Practice reflective listening techniques",
          targetDate: "2024-02-01",
          completed: true,
          completedDate: "2024-01-25",
        },
        {
          id: "m7",
          title: "Practice 'I' statements",
          description: "Use 'I' statements in daily conversations",
          targetDate: "2024-02-20",
          completed: false,
        },
      ],
    },
  ]);

  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: "a1",
      clientId: "c1",
      clientName: "Emma Thompson",
      assessmentType: "GAD-7",
      scale: "Generalized Anxiety Disorder Scale",
      score: 8,
      maxScore: 21,
      dateAdministered: "2024-01-20",
      administeredBy: "Dr. Sarah Wilson",
      severity: "Mild",
      notes: "Significant improvement from initial score of 18",
    },
    {
      id: "a2",
      clientId: "c1",
      clientName: "Emma Thompson",
      assessmentType: "PHQ-9",
      scale: "Patient Health Questionnaire",
      score: 5,
      maxScore: 27,
      dateAdministered: "2024-01-20",
      administeredBy: "Dr. Sarah Wilson",
      severity: "Mild",
      notes: "Depression symptoms well controlled",
    },
    {
      id: "a3",
      clientId: "c2",
      clientName: "Michael Chen",
      assessmentType: "DAS-7",
      scale: "Dyadic Adjustment Scale",
      score: 95,
      maxScore: 151,
      dateAdministered: "2024-01-18",
      administeredBy: "Dr. Sarah Wilson",
      severity: "Moderate",
      notes: "Relationship satisfaction improving",
    },
  ]);

  const [clientProgressData, setClientProgressData] = useState<
    ClientProgress[]
  >([
    {
      clientId: "c1",
      clientName: "Emma Thompson",
      diagnosis: "Generalized Anxiety Disorder",
      treatmentStartDate: "2024-01-01",
      totalSessions: 12,
      activeGoals: 2,
      completedGoals: 0,
      averageProgress: 67.5,
      lastAssessment: {
        id: "a1",
        clientId: "c1",
        clientName: "Emma Thompson",
        assessmentType: "GAD-7",
        scale: "Generalized Anxiety Disorder Scale",
        score: 8,
        maxScore: 21,
        dateAdministered: "2024-01-20",
        administeredBy: "Dr. Sarah Wilson",
        severity: "Mild",
      },
      progressData: [
        { date: "2024-01-01", score: 18, sessionNumber: 1 },
        { date: "2024-01-08", score: 16, sessionNumber: 2 },
        { date: "2024-01-15", score: 14, sessionNumber: 3 },
        { date: "2024-01-22", score: 12, sessionNumber: 4 },
        { date: "2024-01-29", score: 10, sessionNumber: 5 },
        { date: "2024-02-05", score: 8, sessionNumber: 6 },
      ],
    },
    {
      clientId: "c2",
      clientName: "Michael Chen",
      diagnosis: "Relationship Issues",
      treatmentStartDate: "2024-01-05",
      totalSessions: 8,
      activeGoals: 1,
      completedGoals: 0,
      averageProgress: 45,
      lastAssessment: {
        id: "a3",
        clientId: "c2",
        clientName: "Michael Chen",
        assessmentType: "DAS-7",
        scale: "Dyadic Adjustment Scale",
        score: 95,
        maxScore: 151,
        dateAdministered: "2024-01-18",
        administeredBy: "Dr. Sarah Wilson",
        severity: "Moderate",
      },
      progressData: [
        { date: "2024-01-05", score: 85, sessionNumber: 1 },
        { date: "2024-01-12", score: 88, sessionNumber: 2 },
        { date: "2024-01-19", score: 92, sessionNumber: 3 },
        { date: "2024-01-26", score: 95, sessionNumber: 4 },
      ],
    },
  ]);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load progress data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Filter goals
  const filteredGoals = useMemo(() => {
    return treatmentGoals.filter((goal) => {
      const matchesSearch =
        goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClient =
        selectedClient === "all" || goal.clientId === selectedClient;
      const matchesStatus =
        statusFilter === "all" || goal.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || goal.category === categoryFilter;

      return matchesSearch && matchesClient && matchesStatus && matchesCategory;
    });
  }, [
    treatmentGoals,
    searchTerm,
    selectedClient,
    statusFilter,
    categoryFilter,
  ]);

  // Goal management functions
  const handleCreateGoal = useCallback(() => {
    setSelectedGoal(null);
    setGoalForm({
      title: "",
      description: "",
      category: "Symptom",
      priority: "Medium",
      targetDate: "",
      measurableOutcome: "",
      interventions: "",
      clientId: "",
    });
    setGoalModalOpen(true);
  }, []);

  const handleEditGoal = useCallback((goal: TreatmentGoal) => {
    setSelectedGoal(goal);
    setGoalForm({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      priority: goal.priority,
      targetDate: goal.targetDate,
      measurableOutcome: goal.measurableOutcome,
      interventions: goal.interventions.join(", "),
      clientId: goal.clientId,
    });
    setGoalModalOpen(true);
  }, []);

  const handleDeleteGoal = useCallback(
    (goal: TreatmentGoal) => {
      showModal({
        type: "destructive",
        title: "Delete Goal",
        message: `Are you sure you want to delete the goal "${goal.title}"? This action cannot be undone.`,
        confirmLabel: "Delete Goal",
        cancelLabel: "Cancel",
        showCancel: true,
        onConfirm: () => {
          setTreatmentGoals((prev) => prev.filter((g) => g.id !== goal.id));
          toast({
            title: "Goal Deleted",
            description: `"${goal.title}" has been deleted.`,
          });
        },
      });
    },
    [showModal, toast],
  );

  const handleUpdateProgress = useCallback(
    (goalId: string, newProgress: number) => {
      setTreatmentGoals((prev) =>
        prev.map((goal) =>
          goal.id === goalId
            ? {
                ...goal,
                currentProgress: newProgress,
                status: newProgress >= 100 ? "Completed" : goal.status,
              }
            : goal,
        ),
      );

      toast({
        title: "Progress Updated",
        description: `Goal progress updated to ${newProgress}%.`,
      });
    },
    [toast],
  );

  const handleCloseGoalModal = useCallback(() => {
    setGoalModalOpen(false);
    setSelectedGoal(null);
    setGoalForm({
      title: "",
      description: "",
      category: "Symptom",
      priority: "Medium",
      targetDate: "",
      measurableOutcome: "",
      interventions: "",
      clientId: "",
    });
  }, []);

  const handleSaveGoal = useCallback(() => {
    if (!goalForm.title || !goalForm.clientId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const interventionsArray = goalForm.interventions
      ? goalForm.interventions.split(",").map(i => i.trim()).filter(i => i)
      : [];

    if (selectedGoal) {
      // Update existing goal
      setTreatmentGoals(prev =>
        prev.map(goal =>
          goal.id === selectedGoal.id
            ? {
                ...goal,
                title: goalForm.title,
                description: goalForm.description,
                category: goalForm.category,
                priority: goalForm.priority,
                targetDate: goalForm.targetDate,
                measurableOutcome: goalForm.measurableOutcome,
                interventions: interventionsArray,
              }
            : goal
        )
      );

      toast({
        title: "Goal Updated",
        description: `"${goalForm.title}" has been updated.`,
      });
    } else {
      // Create new goal
      const clientName = goalForm.clientId === "c1" ? "Emma Thompson" :
                        goalForm.clientId === "c2" ? "Michael Chen" : "Unknown Client";

      const newGoal: TreatmentGoal = {
        id: `g-${Date.now()}`,
        clientId: goalForm.clientId,
        clientName,
        title: goalForm.title,
        description: goalForm.description,
        category: goalForm.category,
        priority: goalForm.priority,
        status: "Active",
        targetDate: goalForm.targetDate,
        createdDate: new Date().toISOString().split('T')[0],
        currentProgress: 0,
        measurableOutcome: goalForm.measurableOutcome,
        interventions: interventionsArray,
        milestones: [],
      };

      setTreatmentGoals(prev => [newGoal, ...prev]);

      toast({
        title: "Goal Created",
        description: `"${goalForm.title}" has been created.`,
      });
    }

    handleCloseGoalModal();
  }, [goalForm, selectedGoal, toast, handleCloseGoalModal]);

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Completed":
        return "default";
      case "On Hold":
        return "secondary";
      case "Discontinued":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Get progress trend
  const getProgressTrend = (data: ProgressData[]) => {
    if (data.length < 2) return "stable";
    const recent = data.slice(-2);
    const change = recent[1].score - recent[0].score;
    return change > 0 ? "improving" : change < 0 ? "declining" : "stable";
  };

  // Export functionality
  const handleExportProgress = useCallback(() => {
    try {
      const csvHeaders = [
        "Client Name",
        "Goal Title",
        "Category",
        "Priority",
        "Status",
        "Progress %",
        "Target Date",
        "Created Date",
        "Measurable Outcome",
        "Interventions",
      ];

      const csvData = filteredGoals.map((goal) => [
        goal.clientName,
        goal.title,
        goal.category,
        goal.priority,
        goal.status,
        goal.currentProgress.toString(),
        goal.targetDate,
        goal.createdDate,
        `"${goal.measurableOutcome.replace(/"/g, '""')}"`,
        `"${goal.interventions.join(", ")}"`,
      ]);

      const csvContent = [csvHeaders, ...csvData]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `progress-goals-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${filteredGoals.length} goals exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      });
    }
  }, [filteredGoals, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading progress data...</span>
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
              <Target className="h-8 w-8" />
              Progress Tracking
            </h1>
            <p className="text-muted-foreground">
              Track client goals, outcomes, and treatment progress
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportProgress}
              disabled={filteredGoals.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export ({filteredGoals.length})
            </Button>
            <Button onClick={handleCreateGoal}>
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{treatmentGoals.length}</div>
              <p className="text-xs text-muted-foreground">
                Across all clients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Goals
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {treatmentGoals.filter((g) => g.status === "Active").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Goals
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {treatmentGoals.filter((g) => g.status === "Completed").length}
              </div>
              <p className="text-xs text-muted-foreground">Goals achieved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  treatmentGoals.reduce(
                    (sum, goal) => sum + goal.currentProgress,
                    0,
                  ) / treatmentGoals.length,
                )}
                %
              </div>
              <ProgressBar
                value={
                  treatmentGoals.reduce(
                    (sum, goal) => sum + goal.currentProgress,
                    0,
                  ) / treatmentGoals.length
                }
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="goals" className="text-xs sm:text-sm">Goals</TabsTrigger>
            <TabsTrigger value="progress" className="text-xs sm:text-sm">Progress</TabsTrigger>
            <TabsTrigger value="assessments" className="text-xs sm:text-sm">Assessments</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          </TabsList>

          {/* Treatment Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Goal Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="search">Search Goals</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search goals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Select
                      value={selectedClient}
                      onValueChange={setSelectedClient}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Clients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Clients</SelectItem>
                        <SelectItem value="c1">Emma Thompson</SelectItem>
                        <SelectItem value="c2">Michael Chen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Discontinued">
                          Discontinued
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Symptom">Symptom</SelectItem>
                        <SelectItem value="Functional">Functional</SelectItem>
                        <SelectItem value="Behavioral">Behavioral</SelectItem>
                        <SelectItem value="Cognitive">Cognitive</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedClient("all");
                        setStatusFilter("all");
                        setCategoryFilter("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goals List */}
            <div className="grid gap-4">
              {filteredGoals.map((goal) => (
                <Card key={goal.id}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <CardTitle className="text-lg">
                            {goal.title}
                          </CardTitle>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant={getPriorityColor(goal.priority)}>
                              {goal.priority}
                            </Badge>
                            <Badge variant={getStatusColor(goal.status)}>
                              {goal.status}
                            </Badge>
                            <Badge variant="outline">{goal.category}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {goal.clientName} • Target: {goal.targetDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 md:flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditGoal(goal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">{goal.description}</p>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm">
                            {goal.currentProgress}%
                          </span>
                        </div>
                        <ProgressBar value={goal.currentProgress} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">
                            Measurable Outcome
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {goal.measurableOutcome}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Interventions
                          </Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {goal.interventions.map((intervention, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {intervention}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Milestones */}
                      <div>
                        <Label className="text-sm font-medium">
                          Milestones
                        </Label>
                        <div className="space-y-2 mt-2">
                          {goal.milestones.map((milestone) => (
                            <div
                              key={milestone.id}
                              className="flex items-start gap-2 p-3 rounded border bg-gray-50"
                            >
                              {milestone.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              ) : (
                                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {milestone.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {milestone.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Target: {milestone.targetDate}
                                  {milestone.completed &&
                                    ` • Completed: ${milestone.completedDate}`}
                                </p>
                                {milestone.notes && (
                                  <p className="text-xs text-muted-foreground italic">
                                    {milestone.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredGoals.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No goals found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || selectedClient !== "all"
                        ? "Try adjusting your filters"
                        : "Create your first treatment goal to get started"}
                    </p>
                    <Button onClick={handleCreateGoal}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Goal
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Client Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid gap-6">
              {clientProgressData.map((client) => (
                <Card key={client.clientId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{client.clientName}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {client.diagnosis} • {client.totalSessions} sessions
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProgressDetailModalOpen(true)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Progress Chart */}
                      <div>
                        <h4 className="font-medium mb-4">Progress Over Time</h4>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={client.progressData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(value) =>
                                new Date(value).toLocaleDateString()
                              }
                            />
                            <YAxis />
                            <Tooltip
                              labelFormatter={(value) =>
                                `Session ${client.progressData.find((d) => d.date === value)?.sessionNumber}`
                              }
                            />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#0086b3"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Statistics */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 border rounded">
                            <div className="text-2xl font-bold text-green-600">
                              {client.activeGoals}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Active Goals
                            </p>
                          </div>
                          <div className="text-center p-4 border rounded">
                            <div className="text-2xl font-bold text-blue-600">
                              {client.completedGoals}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Completed Goals
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">
                            Average Goal Progress
                          </Label>
                          <div className="flex items-center justify-between mt-1">
                            <ProgressBar
                              value={client.averageProgress}
                              className="flex-1 mr-2"
                            />
                            <span className="text-sm">
                              {client.averageProgress}%
                            </span>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">
                            Latest Assessment
                          </Label>
                          <div className="mt-2 p-3 border rounded">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {client.lastAssessment.assessmentType}
                              </span>
                              <Badge
                                variant={
                                  client.lastAssessment.severity === "Mild"
                                    ? "default"
                                    : client.lastAssessment.severity ===
                                        "Moderate"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {client.lastAssessment.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Score: {client.lastAssessment.score}/
                              {client.lastAssessment.maxScore}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {client.lastAssessment.dateAdministered}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Assessment History</CardTitle>
                <Button onClick={() => setAssessmentModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </CardHeader>
              <CardContent>
                {!isMobile ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Assessment</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assessments.map((assessment) => (
                        <TableRow key={assessment.id}>
                          <TableCell className="font-medium">
                            {assessment.clientName}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {assessment.assessmentType}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {assessment.scale}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>
                                {assessment.score}/{assessment.maxScore}
                              </span>
                              <ProgressBar
                                value={
                                  (assessment.score / assessment.maxScore) * 100
                                }
                                className="w-16"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                assessment.severity === "Minimal" ||
                                assessment.severity === "Mild"
                                  ? "default"
                                  : assessment.severity === "Moderate"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {assessment.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>{assessment.dateAdministered}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="space-y-4">
                    {assessments.map((assessment) => (
                      <Card key={assessment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{assessment.clientName}</h4>
                              <p className="text-sm text-muted-foreground">
                                {assessment.assessmentType}
                              </p>
                            </div>
                            <Badge
                              variant={
                                assessment.severity === "Minimal" ||
                                assessment.severity === "Mild"
                                  ? "default"
                                  : assessment.severity === "Moderate"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {assessment.severity}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Score:</span>
                              <span className="text-sm font-medium">
                                {assessment.score}/{assessment.maxScore}
                              </span>
                            </div>
                            <ProgressBar
                              value={(assessment.score / assessment.maxScore) * 100}
                            />
                            <p className="text-xs text-muted-foreground">
                              {assessment.dateAdministered}
                            </p>
                            <Button variant="ghost" size="sm" className="w-full">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Goal Categories Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Goal Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(
                          treatmentGoals.reduce(
                            (acc, goal) => {
                              acc[goal.category] =
                                (acc[goal.category] || 0) + 1;
                              return acc;
                            },
                            {} as Record<string, number>,
                          ),
                        ).map(([category, count]) => ({
                          category,
                          count,
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        label={({ category, count }) => `${category}: ${count}`}
                      >
                        {Object.keys(
                          treatmentGoals.reduce(
                            (acc, goal) => {
                              acc[goal.category] =
                                (acc[goal.category] || 0) + 1;
                              return acc;
                            },
                            {} as Record<string, number>,
                          ),
                        ).map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(${200 + index * 40}, 70%, 50%)`}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Progress Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        {
                          range: "0-25%",
                          count: treatmentGoals.filter(
                            (g) => g.currentProgress <= 25,
                          ).length,
                        },
                        {
                          range: "26-50%",
                          count: treatmentGoals.filter(
                            (g) =>
                              g.currentProgress > 25 && g.currentProgress <= 50,
                          ).length,
                        },
                        {
                          range: "51-75%",
                          count: treatmentGoals.filter(
                            (g) =>
                              g.currentProgress > 50 && g.currentProgress <= 75,
                          ).length,
                        },
                        {
                          range: "76-100%",
                          count: treatmentGoals.filter(
                            (g) => g.currentProgress > 75,
                          ).length,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0086b3" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Summary Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Treatment Outcomes Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded">
                    <div className="text-3xl font-bold text-green-600">
                      {Math.round(
                        (treatmentGoals.filter((g) => g.status === "Completed")
                          .length /
                          treatmentGoals.length) *
                          100,
                      )}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Goal Completion Rate
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-3xl font-bold text-blue-600">
                      {Math.round(
                        treatmentGoals.reduce(
                          (sum, goal) => sum + goal.currentProgress,
                          0,
                        ) / treatmentGoals.length,
                      )}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Average Progress
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-3xl font-bold text-purple-600">
                      {
                        treatmentGoals.filter((g) => g.priority === "High")
                          .length
                      }
                    </div>
                    <p className="text-sm text-muted-foreground">
                      High Priority Goals
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-3xl font-bold text-orange-600">
                      {assessments.length}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Assessments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Goal Edit/Create Modal */}
        {goalModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {selectedGoal ? "Edit Goal" : "Create New Goal"}
                </h2>
                <button
                  onClick={handleCloseGoalModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client">Client *</Label>
                    <Select
                      value={goalForm.clientId}
                      onValueChange={(value) =>
                        setGoalForm(prev => ({ ...prev, clientId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="c1">Emma Thompson</SelectItem>
                        <SelectItem value="c2">Michael Chen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={goalForm.category}
                      onValueChange={(value) =>
                        setGoalForm(prev => ({ ...prev, category: value as TreatmentGoal["category"] }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Symptom">Symptom</SelectItem>
                        <SelectItem value="Functional">Functional</SelectItem>
                        <SelectItem value="Behavioral">Behavioral</SelectItem>
                        <SelectItem value="Cognitive">Cognitive</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Goal Title *</Label>
                  <Input
                    placeholder="Enter goal title..."
                    value={goalForm.title}
                    onChange={(e) =>
                      setGoalForm(prev => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    placeholder="Describe the treatment goal..."
                    value={goalForm.description}
                    onChange={(e) =>
                      setGoalForm(prev => ({ ...prev, description: e.target.value }))
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={goalForm.priority}
                      onValueChange={(value) =>
                        setGoalForm(prev => ({ ...prev, priority: value as TreatmentGoal["priority"] }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="targetDate">Target Date</Label>
                    <Input
                      type="date"
                      value={goalForm.targetDate}
                      onChange={(e) =>
                        setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="measurableOutcome">Measurable Outcome</Label>
                  <Textarea
                    placeholder="How will success be measured?"
                    value={goalForm.measurableOutcome}
                    onChange={(e) =>
                      setGoalForm(prev => ({ ...prev, measurableOutcome: e.target.value }))
                    }
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="interventions">Interventions</Label>
                  <Input
                    placeholder="Enter interventions separated by commas..."
                    value={goalForm.interventions}
                    onChange={(e) =>
                      setGoalForm(prev => ({ ...prev, interventions: e.target.value }))
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate multiple interventions with commas
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={handleCloseGoalModal}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGoal}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {selectedGoal ? "Update Goal" : "Create Goal"}
                </button>
              </div>
            </div>
          </div>
        )}

        <ModalComponent />
      </div>
    </Layout>
  );
};

export default Progress;
