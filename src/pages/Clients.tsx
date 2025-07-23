import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { NewClientModal } from "@/components/modals/NewClientModal";
import { ClientDetailModal } from "@/components/modals/ClientDetailModal";
import { ClientProfileModal } from "@/components/ClientProfileModal";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Calendar,
  Phone,
  Mail,
  Filter,
  Download,
  Loader2,
  AlertCircle,
  Users,
  User,
  Heart,
  Shield,
  Clock,
  FileText,
  TrendingUp,
  AlertTriangle,
  MapPin,
  CreditCard,
  UserPlus,
  Activity,
  MoreVertical,
  Trash2,
} from "lucide-react";

// Types for better type safety
interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "Pending";
  lastSession: string | null;
  nextSession: string | null;
  sessionsCount: number;
  diagnosis: string;
  insurance: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
  notes?: string;
}

interface ClientStats {
  total: number;
  active: number;
  newThisMonth: number;
  averageSessions: number;
}

const Clients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showModal, ModalComponent } = useConfirmationModal();

  // State management
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [clientDetailModalOpen, setClientDetailModalOpen] = useState(false);
  const [clientProfileModalOpen, setClientProfileModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Mock client data - in real app would be fetched from API
  const mockClients: Client[] = [
    {
      id: 1,
      name: "Emma Thompson",
      email: "emma.t@email.com",
      phone: "(555) 123-4567",
      status: "Active",
      lastSession: "2024-01-15",
      nextSession: "2024-01-22",
      sessionsCount: 12,
      diagnosis: "Generalized Anxiety Disorder",
      insurance: "Blue Cross Blue Shield",
      dateOfBirth: "1985-03-15",
      emergencyContact: "John Thompson (Spouse)",
      emergencyPhone: "(555) 123-4568",
      address: "123 Main St, City, State 12345",
      notes: "Prefers morning appointments. Making good progress.",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "(555) 234-5678",
      status: "Active",
      lastSession: "2024-01-14",
      nextSession: "2024-01-21",
      sessionsCount: 8,
      diagnosis: "Relationship Issues",
      insurance: "Aetna",
      dateOfBirth: "1990-07-22",
      emergencyContact: "Lisa Chen (Partner)",
      emergencyPhone: "(555) 234-5679",
      address: "456 Oak Ave, City, State 12345",
      notes: "Couples therapy sessions. Both partners engaged.",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(555) 345-6789",
      status: "Active",
      lastSession: "2024-01-13",
      nextSession: "2024-01-20",
      sessionsCount: 15,
      diagnosis: "Major Depressive Disorder",
      insurance: "Cigna",
      dateOfBirth: "1988-11-08",
      emergencyContact: "Mary Johnson (Mother)",
      emergencyPhone: "(555) 345-6790",
      address: "789 Pine St, City, State 12345",
      notes: "Excellent progress. Medication compliance good.",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "d.wilson@email.com",
      phone: "(555) 456-7890",
      status: "Pending",
      lastSession: null,
      nextSession: "2024-01-23",
      sessionsCount: 0,
      diagnosis: "Initial Assessment",
      insurance: "United Healthcare",
      dateOfBirth: "1992-05-12",
      emergencyContact: "Robert Wilson (Father)",
      emergencyPhone: "(555) 456-7891",
      address: "321 Elm St, City, State 12345",
      notes: "New client intake scheduled.",
    },
    {
      id: 5,
      name: "Lisa Park",
      email: "l.park@email.com",
      phone: "(555) 567-8901",
      status: "Active",
      lastSession: "2024-01-12",
      nextSession: "2024-01-19",
      sessionsCount: 22,
      diagnosis: "Post-Traumatic Stress Disorder",
      insurance: "Kaiser Permanente",
      dateOfBirth: "1983-09-30",
      emergencyContact: "James Park (Brother)",
      emergencyPhone: "(555) 567-8902",
      address: "654 Maple Dr, City, State 12345",
      notes: "EMDR therapy sessions. Significant improvement.",
    },
    {
      id: 6,
      name: "James Rodriguez",
      email: "j.rodriguez@email.com",
      phone: "(555) 678-9012",
      status: "Inactive",
      lastSession: "2023-12-15",
      nextSession: null,
      sessionsCount: 6,
      diagnosis: "Adjustment Disorder",
      insurance: "Humana",
      dateOfBirth: "1995-01-18",
      emergencyContact: "Maria Rodriguez (Sister)",
      emergencyPhone: "(555) 678-9013",
      address: "987 Cedar Ln, City, State 12345",
      notes: "Completed treatment goals. Available for follow-up.",
    },
  ];

  // Initialize clients data
  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call with random delay between 300-1000ms
        const delay = Math.random() * 700 + 300;
        await new Promise((resolve) => setTimeout(resolve, delay));

        setClients(mockClients);
      } catch (err) {
        console.error("Failed to load clients:", err);
        setError("Failed to load clients. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  // Calculate statistics
  const stats = useMemo((): ClientStats => {
    const total = clients.length;
    const active = clients.filter(
      (client) => client.status === "Active",
    ).length;
    const newThisMonth = clients.filter((client) => {
      const lastSession = client.lastSession
        ? new Date(client.lastSession)
        : null;
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return lastSession && lastSession >= oneMonthAgo;
    }).length;
    const totalSessions = clients.reduce(
      (sum, client) => sum + client.sessionsCount,
      0,
    );
    const averageSessions =
      total > 0 ? Math.round((totalSessions / total) * 10) / 10 : 0;

    return {
      total,
      active,
      newThisMonth,
      averageSessions,
    };
  }, [clients]);

  // Filter clients based on search and status
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  // Handle client actions
  const handleEditClient = useCallback(
    (client: Client) => {
      setSelectedClient(client);
      setClientDetailModalOpen(true);
      toast({
        title: "Edit Mode",
        description: `Editing ${client.name}'s information.`,
      });
    },
    [toast],
  );

  const handleViewClient = useCallback((client: Client) => {
    setSelectedClient(client);
    setClientProfileModalOpen(true);
  }, []);

  const handleScheduleSession = useCallback(
    (client: Client) => {
      navigate(`/sessions?client=${client.id}`);
      toast({
        title: "Schedule Session",
        description: `Scheduling session for ${client.name}.`,
      });
    },
    [navigate, toast],
  );

  const handleDeleteClient = useCallback(
    (client: Client) => {
      showModal({
        type: "destructive",
        title: "Delete Client",
        message: `Are you sure you want to delete ${client.name}? This action cannot be undone and will remove all associated session data.`,
        confirmLabel: "Delete Client",
        cancelLabel: "Cancel",
        showCancel: true,
        onConfirm: () => {
          setClients((prev) => prev.filter((c) => c.id !== client.id));
          toast({
            title: "Client Deleted",
            description: `${client.name} has been removed from your client list.`,
          });
        },
      });
    },
    [showModal, toast],
  );

  const handleExportClients = useCallback(() => {
    try {
      if (filteredClients.length === 0) {
        toast({
          title: "No Data to Export",
          description: "There are no clients to export. Add some clients first.",
          variant: "destructive",
        });
        return;
      }

      const csvHeaders = [
        "Name",
        "Email",
        "Phone",
        "Status",
        "Diagnosis",
        "Insurance",
        "Sessions Count",
        "Last Session",
        "Next Session",
        "Date of Birth",
        "Emergency Contact",
        "Emergency Phone",
        "Address",
        "Notes",
      ];

      const csvData = filteredClients.map((client) => [
        client.name || "",
        client.email || "",
        client.phone || "",
        client.status || "",
        client.diagnosis || "",
        client.insurance || "",
        client.sessionsCount?.toString() || "0",
        client.lastSession || "",
        client.nextSession || "",
        client.dateOfBirth || "",
        client.emergencyContact || "",
        client.emergencyPhone || "",
        client.address || "",
        `"${(client.notes || "").replace(/"/g, '""')}"`,
      ]);

      const csvContent = [csvHeaders, ...csvData]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `clients-${new Date().toISOString().split("T")[0]}.csv`;
      link.setAttribute("aria-label", "Download client data as CSV file");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${filteredClients.length} clients exported successfully.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting clients. Please try again.",
        variant: "destructive",
      });
    }
  }, [filteredClients, toast]);

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "Pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: Client["status"]) => {
    switch (status) {
      case "Active":
        return <Activity className="h-3 w-3" />;
      case "Inactive":
        return <Clock className="h-3 w-3" />;
      case "Pending":
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading clients...</span>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 sm:h-8 sm:w-8" />
              Clients
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your client information and treatment progress
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportClients}
              disabled={filteredClients.length === 0}
              size="sm"
              className="text-xs sm:text-sm"
            >
              <Download className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export </span>({filteredClients.length})
            </Button>
            <Button onClick={() => setNewClientModalOpen(true)} size="sm" className="text-xs sm:text-sm">
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add </span>Client
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Clients
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New This Month
              </CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newThisMonth}</div>
              <p className="text-xs text-muted-foreground">Recent clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Sessions
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageSessions}</div>
              <p className="text-xs text-muted-foreground">Per client</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Client Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients by name, email, or diagnosis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    aria-label="Search clients"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Client List ({filteredClients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4">
              {filteredClients.map((client) => (
                <Card key={client.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-medium text-base">{client.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {client.diagnosis}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {client.insurance}
                        </Badge>
                      </div>
                      <Badge
                        variant={getStatusColor(client.status)}
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(client.status)}
                        {client.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{client.phone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs">Sessions</div>
                        <div className="font-medium">{client.sessionsCount}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Last Session</div>
                        <div className="font-medium">
                          {client.lastSession
                            ? new Date(client.lastSession).toLocaleDateString()
                            : "None"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-muted-foreground">
                        Next: {client.nextSession
                          ? new Date(client.nextSession).toLocaleDateString()
                          : "Not scheduled"}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewClient(client)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleScheduleSession(client)}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Session
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClient(client)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Sessions</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Session</TableHead>
                    <TableHead className="hidden xl:table-cell">Next Session</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {client.diagnosis}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {client.insurance}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusColor(client.status)}
                          className="flex items-center gap-1 w-fit"
                        >
                          {getStatusIcon(client.status)}
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-center">
                          <div className="font-medium">
                            {client.sessionsCount}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            total
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">
                          {client.lastSession
                            ? new Date(client.lastSession).toLocaleDateString()
                            : "None"}
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="text-sm">
                          {client.nextSession
                            ? new Date(client.nextSession).toLocaleDateString()
                            : "Not scheduled"}
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
                              onClick={() => handleViewClient(client)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClient(client)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Client
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleScheduleSession(client)}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule Session
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClient(client)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No clients found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "Try adjusting your search or filters"
                    : "Add your first client to get started"}
                </p>
                <Button onClick={() => setNewClientModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <NewClientModal
          open={newClientModalOpen}
          onOpenChange={setNewClientModalOpen}
        />
        <ClientDetailModal
          open={clientDetailModalOpen}
          onOpenChange={setClientDetailModalOpen}
          client={selectedClient}
        />
        <ClientProfileModal
          open={clientProfileModalOpen}
          onOpenChange={setClientProfileModalOpen}
          client={selectedClient}
        />
        <ModalComponent />
      </div>
    </Layout>
  );
};

export default Clients;
