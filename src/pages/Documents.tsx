import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Folder,
  File,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  FileText,
  FileImage,
  Sheet,
  FileType,
  Video,
  AudioWaveform,
  Archive,
  Plus,
  FolderOpen,
  Calendar,
  User,
  Clock,
  Star,
  StarOff,
  Share,
  Lock,
  Unlock,
  RefreshCw,
  Grid,
  List,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

// Types for document management
interface DocumentFile {
  id: string;
  name: string;
  originalName: string;
  type: string;
  size: number;
  clientId: string;
  clientName: string;
  category:
    | "Intake Forms"
    | "Assessments"
    | "Treatment Plans"
    | "Progress Notes"
    | "Insurance"
    | "Legal"
    | "Administrative"
    | "Other";
  uploadDate: string;
  uploadedBy: string;
  description?: string;
  isConfidential: boolean;
  isStarred: boolean;
  lastAccessed?: string;
  version: number;
  tags: string[];
}

interface ClientFolder {
  clientId: string;
  clientName: string;
  documentCount: number;
  lastActivity: string;
  totalSize: number;
}

const Documents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showModal, ModalComponent } = useConfirmationModal();

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(
    null,
  );
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [showConfidentialOnly, setShowConfidentialOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("documents");

  // Mock document data
  const [documents, setDocuments] = useState<DocumentFile[]>([
    {
      id: "doc1",
      name: "Initial_Intake_Form_Emma_Thompson.pdf",
      originalName: "Initial Intake Form - Emma Thompson.pdf",
      type: "application/pdf",
      size: 2456789,
      clientId: "c1",
      clientName: "Emma Thompson",
      category: "Intake Forms",
      uploadDate: "2024-01-15T10:30:00Z",
      uploadedBy: "Dr. Sarah Wilson",
      description: "Initial client intake form and history",
      isConfidential: true,
      isStarred: false,
      lastAccessed: "2024-01-20T14:22:00Z",
      version: 1,
      tags: ["intake", "new-client", "anxiety"],
    },
    {
      id: "doc2",
      name: "GAD7_Assessment_Emma_Thompson_2024-01-20.pdf",
      originalName: "GAD-7 Assessment - Emma Thompson - January 2024.pdf",
      type: "application/pdf",
      size: 156789,
      clientId: "c1",
      clientName: "Emma Thompson",
      category: "Assessments",
      uploadDate: "2024-01-20T15:45:00Z",
      uploadedBy: "Dr. Sarah Wilson",
      description: "GAD-7 assessment results showing mild anxiety",
      isConfidential: true,
      isStarred: true,
      lastAccessed: "2024-01-22T09:15:00Z",
      version: 1,
      tags: ["gad-7", "assessment", "anxiety", "baseline"],
    },
    {
      id: "doc3",
      name: "Treatment_Plan_Emma_Thompson_v2.docx",
      originalName: "Treatment Plan - Emma Thompson - Updated.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 89456,
      clientId: "c1",
      clientName: "Emma Thompson",
      category: "Treatment Plans",
      uploadDate: "2024-01-22T11:20:00Z",
      uploadedBy: "Dr. Sarah Wilson",
      description: "Updated treatment plan with CBT interventions",
      isConfidential: true,
      isStarred: true,
      lastAccessed: "2024-01-23T08:30:00Z",
      version: 2,
      tags: ["treatment-plan", "cbt", "anxiety", "goals"],
    },
    {
      id: "doc4",
      name: "Insurance_Authorization_Emma_Thompson.pdf",
      originalName: "Insurance Pre-Authorization - Emma Thompson.pdf",
      type: "application/pdf",
      size: 334567,
      clientId: "c1",
      clientName: "Emma Thompson",
      category: "Insurance",
      uploadDate: "2024-01-10T09:00:00Z",
      uploadedBy: "Office Manager",
      description: "Insurance pre-authorization for 12 sessions",
      isConfidential: false,
      isStarred: false,
      lastAccessed: "2024-01-15T13:45:00Z",
      version: 1,
      tags: ["insurance", "authorization", "blue-cross"],
    },
    {
      id: "doc5",
      name: "Couples_Intake_Michael_Sarah_Chen.pdf",
      originalName: "Couples Therapy Intake - Michael & Sarah Chen.pdf",
      type: "application/pdf",
      size: 2789123,
      clientId: "c2",
      clientName: "Michael & Sarah Chen",
      category: "Intake Forms",
      uploadDate: "2024-01-12T14:30:00Z",
      uploadedBy: "Dr. Sarah Wilson",
      description: "Couples therapy intake forms for both partners",
      isConfidential: true,
      isStarred: false,
      lastAccessed: "2024-01-18T16:20:00Z",
      version: 1,
      tags: ["couples", "intake", "relationship"],
    },
    {
      id: "doc6",
      name: "DAS7_Assessment_Michael_Chen.pdf",
      originalName: "Dyadic Adjustment Scale - Michael Chen.pdf",
      type: "application/pdf",
      size: 178456,
      clientId: "c2",
      clientName: "Michael & Sarah Chen",
      category: "Assessments",
      uploadDate: "2024-01-18T10:15:00Z",
      uploadedBy: "Dr. Sarah Wilson",
      description: "Dyadic Adjustment Scale assessment results",
      isConfidential: true,
      isStarred: false,
      lastAccessed: "2024-01-20T11:30:00Z",
      version: 1,
      tags: ["das-7", "couples", "assessment", "relationship"],
    },
    {
      id: "doc7",
      name: "Progress_Notes_Session_5_Sarah_Johnson.docx",
      originalName: "Progress Notes Session 5 - Sarah Johnson.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 45678,
      clientId: "c3",
      clientName: "Sarah Johnson",
      category: "Progress Notes",
      uploadDate: "2024-01-25T17:00:00Z",
      uploadedBy: "Dr. Sarah Wilson",
      description: "Detailed progress notes from session 5",
      isConfidential: true,
      isStarred: false,
      lastAccessed: "2024-01-25T17:05:00Z",
      version: 1,
      tags: ["progress", "session-notes", "depression"],
    },
    {
      id: "doc8",
      name: "HIPAA_Forms_David_Wilson.pdf",
      originalName: "HIPAA Privacy Forms - David Wilson.pdf",
      type: "application/pdf",
      size: 567890,
      clientId: "c4",
      clientName: "David Wilson",
      category: "Legal",
      uploadDate: "2024-01-08T12:00:00Z",
      uploadedBy: "Office Manager",
      description: "Signed HIPAA privacy and consent forms",
      isConfidential: false,
      isStarred: false,
      lastAccessed: "2024-01-10T14:30:00Z",
      version: 1,
      tags: ["hipaa", "consent", "legal", "privacy"],
    },
  ]);

  // Mock upload data for simulation
  const [uploadData, setUploadData] = useState({
    clientId: "",
    category: "Other",
    description: "",
    isConfidential: true,
    tags: "",
  });

  // Initialize data
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load documents.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, []); // Remove toast dependency to prevent infinite loop

  // Get client folders
  const clientFolders = useMemo((): ClientFolder[] => {
    const clientGroups = documents.reduce(
      (acc, doc) => {
        if (!acc[doc.clientId]) {
          acc[doc.clientId] = {
            clientId: doc.clientId,
            clientName: doc.clientName,
            documents: [],
          };
        }
        acc[doc.clientId].documents.push(doc);
        return acc;
      },
      {} as Record<
        string,
        { clientId: string; clientName: string; documents: DocumentFile[] }
      >,
    );

    return Object.values(clientGroups).map((group) => ({
      clientId: group.clientId,
      clientName: group.clientName,
      documentCount: group.documents.length,
      lastActivity:
        group.documents.sort(
          (a, b) =>
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
        )[0]?.uploadDate || "",
      totalSize: group.documents.reduce((sum, doc) => sum + doc.size, 0),
    }));
  }, [documents]);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesClient =
        selectedClient === "all" || doc.clientId === selectedClient;
      const matchesCategory =
        selectedCategory === "all" || doc.category === selectedCategory;
      const matchesStarred = !showStarredOnly || doc.isStarred;
      const matchesConfidential = !showConfidentialOnly || doc.isConfidential;

      return (
        matchesSearch &&
        matchesClient &&
        matchesCategory &&
        matchesStarred &&
        matchesConfidential
      );
    });
  }, [
    documents,
    searchTerm,
    selectedClient,
    selectedCategory,
    showStarredOnly,
    showConfidentialOnly,
  ]);

  // File icon mapping
  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return FileType;
    if (type.includes("image")) return FileImage;
    if (type.includes("spreadsheet") || type.includes("excel")) return Sheet;
    if (type.includes("video")) return Video;
    if (type.includes("audio")) return AudioWaveform;
    if (type.includes("zip") || type.includes("rar")) return Archive;
    if (type.includes("word") || type.includes("document")) return FileText;
    return File;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle file upload simulation
  const handleUpload = useCallback(() => {
    if (!uploadData.clientId) {
      toast({
        title: "Validation Error",
        description: "Please select a client.",
        variant: "destructive",
      });
      return;
    }

    // Simulate file upload
    const clientName =
      clientFolders.find((c) => c.clientId === uploadData.clientId)
        ?.clientName || "Unknown Client";

    const newDocument: DocumentFile = {
      id: `doc-${Date.now()}`,
      name: `Uploaded_Document_${Date.now()}.pdf`,
      originalName: "Uploaded Document.pdf",
      type: "application/pdf",
      size: Math.floor(Math.random() * 1000000) + 100000,
      clientId: uploadData.clientId,
      clientName,
      category: uploadData.category as DocumentFile["category"],
      uploadDate: new Date().toISOString(),
      uploadedBy: "Dr. Sarah Wilson",
      description: uploadData.description,
      isConfidential: uploadData.isConfidential,
      isStarred: false,
      version: 1,
      tags: uploadData.tags
        ? uploadData.tags.split(",").map((tag) => tag.trim())
        : [],
    };

    setDocuments((prev) => [newDocument, ...prev]);
    setUploadModalOpen(false);
    setUploadData({
      clientId: "",
      category: "Other",
      description: "",
      isConfidential: true,
      tags: "",
    });

    toast({
      title: "File Uploaded",
      description: "Document uploaded successfully.",
    });
  }, [uploadData, clientFolders]); // Remove toast dependency

  // Handle document actions
  const handleDocumentAction = useCallback(
    (action: string, document: DocumentFile) => {
      switch (action) {
        case "view":
          setSelectedDocument(document);
          setViewModalOpen(true);
          break;

        case "download":
          // Simulate download
          toast({
            title: "Download Started",
            description: `Downloading ${document.originalName}...`,
          });
          break;

        case "star":
          setDocuments((prev) =>
            prev.map((doc) =>
              doc.id === document.id
                ? { ...doc, isStarred: !doc.isStarred }
                : doc,
            ),
          );
          toast({
            title: document.isStarred
              ? "Removed from Starred"
              : "Added to Starred",
            description: `${document.originalName} ${document.isStarred ? "removed from" : "added to"} starred documents.`,
          });
          break;

        case "delete":
          showModal({
            type: "destructive",
            title: "Delete Document",
            message: `Are you sure you want to delete "${document.originalName}"? This action cannot be undone.`,
            confirmLabel: "Delete Document",
            cancelLabel: "Cancel",
            showCancel: true,
            onConfirm: () => {
              setDocuments((prev) =>
                prev.filter((doc) => doc.id !== document.id),
              );
              toast({
                title: "Document Deleted",
                description: `${document.originalName} has been deleted.`,
              });
            },
          });
          break;
      }
    },
    [showModal], // Remove toast dependency
  );

  // Export documents
  const handleExportDocuments = useCallback(() => {
    try {
      const csvHeaders = [
        "Client Name",
        "Document Name",
        "Category",
        "File Size",
        "Upload Date",
        "Uploaded By",
        "Confidential",
        "Starred",
        "Version",
        "Tags",
        "Description",
      ];

      const csvData = filteredDocuments.map((doc) => [
        doc.clientName,
        doc.originalName,
        doc.category,
        formatFileSize(doc.size),
        formatDate(doc.uploadDate),
        doc.uploadedBy,
        doc.isConfidential ? "Yes" : "No",
        doc.isStarred ? "Yes" : "No",
        doc.version.toString(),
        doc.tags.join(", "),
        `"${(doc.description || "").replace(/"/g, '""')}"`,
      ]);

      const csvContent = [csvHeaders, ...csvData]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `documents-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${filteredDocuments.length} documents exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the documents.",
        variant: "destructive",
      });
    }
  }, [filteredDocuments]); // Remove toast dependency

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading documents...</span>
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
              <Folder className="h-8 w-8" />
              Documents
            </h1>
            <p className="text-muted-foreground">
              Manage client documents, files, and records
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportDocuments}
              disabled={filteredDocuments.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export ({filteredDocuments.length})
            </Button>
            <Button onClick={() => setUploadModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground">All files</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Client Folders
              </CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientFolders.length}</div>
              <p className="text-xs text-muted-foreground">Organized clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Confidential Files
              </CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.filter((d) => d.isConfidential).length}
              </div>
              <p className="text-xs text-muted-foreground">Secure documents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Storage
              </CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatFileSize(
                  documents.reduce((sum, doc) => sum + doc.size, 0),
                )}
              </div>
              <p className="text-xs text-muted-foreground">Used space</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents">All Documents</TabsTrigger>
            <TabsTrigger value="folders">Client Folders</TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Document Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div>
                    <Label htmlFor="search">Search Documents</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search files..."
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
                        {clientFolders.map((folder) => (
                          <SelectItem
                            key={folder.clientId}
                            value={folder.clientId}
                          >
                            {folder.clientName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Intake Forms">
                          Intake Forms
                        </SelectItem>
                        <SelectItem value="Assessments">Assessments</SelectItem>
                        <SelectItem value="Treatment Plans">
                          Treatment Plans
                        </SelectItem>
                        <SelectItem value="Progress Notes">
                          Progress Notes
                        </SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                        <SelectItem value="Administrative">
                          Administrative
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant={showStarredOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowStarredOnly(!showStarredOnly)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Starred
                    </Button>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant={showConfidentialOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setShowConfidentialOnly(!showConfidentialOnly)
                      }
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Confidential
                    </Button>
                  </div>

                  <div className="flex items-end gap-2">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents List/Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === "list" ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Upload Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDocuments.map((document) => {
                          const FileIcon = getFileIcon(document.type);
                          return (
                            <TableRow key={document.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <FileIcon className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <div className="font-medium">
                                      {document.originalName}
                                    </div>
                                    {document.description && (
                                      <div className="text-sm text-muted-foreground">
                                        {document.description}
                                      </div>
                                    )}
                                  </div>
                                  {document.isStarred && (
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{document.clientName}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {document.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {formatFileSize(document.size)}
                              </TableCell>
                              <TableCell>
                                {formatDate(document.uploadDate)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {document.isConfidential ? (
                                    <Lock className="h-3 w-3 text-red-600" />
                                  ) : (
                                    <Unlock className="h-3 w-3 text-green-600" />
                                  )}
                                  <span className="text-sm">
                                    {document.isConfidential
                                      ? "Confidential"
                                      : "Standard"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDocumentAction("view", document)
                                      }
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDocumentAction(
                                          "download",
                                          document,
                                        )
                                      }
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDocumentAction("star", document)
                                      }
                                    >
                                      {document.isStarred ? (
                                        <StarOff className="h-4 w-4 mr-2" />
                                      ) : (
                                        <Star className="h-4 w-4 mr-2" />
                                      )}
                                      {document.isStarred
                                        ? "Remove Star"
                                        : "Add Star"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDocumentAction("delete", document)
                                      }
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredDocuments.map((document) => {
                      const FileIcon = getFileIcon(document.type);
                      return (
                        <Card
                          key={document.id}
                          className="relative hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <FileIcon className="h-8 w-8 text-muted-foreground" />
                              <div className="flex items-center gap-1">
                                {document.isStarred && (
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                )}
                                {document.isConfidential && (
                                  <Lock className="h-3 w-3 text-red-600" />
                                )}
                              </div>
                            </div>
                            <h4 className="font-medium text-sm mb-1 line-clamp-2">
                              {document.originalName}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {document.clientName}
                            </p>
                            <Badge variant="outline" className="text-xs mb-2">
                              {document.category}
                            </Badge>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{formatFileSize(document.size)}</span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDocumentAction("view", document)
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDocumentAction("download", document)
                                    }
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDocumentAction("delete", document)
                                    }
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No documents found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || selectedClient !== "all"
                        ? "Try adjusting your filters"
                        : "Upload your first document to get started"}
                    </p>
                    <Button onClick={() => setUploadModalOpen(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Folders Tab */}
          <TabsContent value="folders" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientFolders.map((folder) => (
                <Card
                  key={folder.clientId}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedClient(folder.clientId);
                    setActiveTab("documents");
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FolderOpen className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">{folder.clientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {folder.documentCount} documents
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Total Size:</span>
                        <span>{formatFileSize(folder.totalSize)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Last Activity:</span>
                        <span>{formatDate(folder.lastActivity)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Upload Modal */}
        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client">Client *</Label>
                <Select
                  value={uploadData.clientId}
                  onValueChange={(value) =>
                    setUploadData((prev) => ({ ...prev, clientId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientFolders.map((folder) => (
                      <SelectItem key={folder.clientId} value={folder.clientId}>
                        {folder.clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={uploadData.category}
                  onValueChange={(value) =>
                    setUploadData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Intake Forms">Intake Forms</SelectItem>
                    <SelectItem value="Assessments">Assessments</SelectItem>
                    <SelectItem value="Treatment Plans">
                      Treatment Plans
                    </SelectItem>
                    <SelectItem value="Progress Notes">
                      Progress Notes
                    </SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Administrative">
                      Administrative
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  placeholder="Brief description of the document..."
                  value={uploadData.description}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  placeholder="Enter tags separated by commas"
                  value={uploadData.tags}
                  onChange={(e) =>
                    setUploadData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confidential"
                  checked={uploadData.isConfidential}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      isConfidential: e.target.checked,
                    }))
                  }
                />
                <Label htmlFor="confidential">Mark as confidential</Label>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC, DOCX, JPG, PNG up to 10MB
                </p>
                <Button variant="outline" className="mt-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File (Demo)
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setUploadModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Document View Modal */}
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent className="max-w-2xl">
            {selectedDocument &&
              (() => {
                const FileIcon = getFileIcon(selectedDocument.type);
                return (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileIcon className="h-5 w-5" />
                        {selectedDocument.originalName}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Client</Label>
                          <p className="text-sm">
                            {selectedDocument.clientName}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Category
                          </Label>
                          <Badge variant="outline">
                            {selectedDocument.category}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            File Size
                          </Label>
                          <p className="text-sm">
                            {formatFileSize(selectedDocument.size)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Upload Date
                          </Label>
                          <p className="text-sm">
                            {formatDate(selectedDocument.uploadDate)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Uploaded By
                          </Label>
                          <p className="text-sm">
                            {selectedDocument.uploadedBy}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Version</Label>
                          <p className="text-sm">v{selectedDocument.version}</p>
                        </div>
                      </div>

                      {selectedDocument.description && (
                        <div>
                          <Label className="text-sm font-medium">
                            Description
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {selectedDocument.description}
                          </p>
                        </div>
                      )}

                      {selectedDocument.tags.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Tags</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedDocument.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {selectedDocument.isConfidential ? (
                            <Lock className="h-4 w-4 text-red-600" />
                          ) : (
                            <Unlock className="h-4 w-4 text-green-600" />
                          )}
                          <span className="text-sm">
                            {selectedDocument.isConfidential
                              ? "Confidential"
                              : "Standard"}
                          </span>
                        </div>
                        {selectedDocument.isStarred && (
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">Starred</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-center text-muted-foreground">
                          Document preview would appear here in the full version
                        </p>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Direct download action without calling handleDocumentAction
                          toast({
                            title: "Download Started",
                            description: `Downloading ${selectedDocument.originalName}...`,
                          });
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button onClick={() => setViewModalOpen(false)}>
                        Close
                      </Button>
                    </DialogFooter>
                  </>
                );
              })()}
          </DialogContent>
        </Dialog>

        <ModalComponent />
      </div>
    </Layout>
  );
};

export default Documents;
