import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { NewClientModal } from "@/components/modals/NewClientModal";
import { ClientDetailModal } from "@/components/modals/ClientDetailModal";
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
import {
  Search,
  Plus,
  MoreVertical,
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
      diagnosis: "Anxiety Disorder",
      insurance: "Blue Cross",
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
      diagnosis: "Depression",
      insurance: "Aetna",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(555) 345-6789",
      status: "Inactive",
      lastSession: "2023-12-20",
      nextSession: null,
      sessionsCount: 15,
      diagnosis: "PTSD",
      insurance: "United Healthcare",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "d.wilson@email.com",
      phone: "(555) 456-7890",
      status: "Active",
      lastSession: "2024-01-16",
      nextSession: "2024-01-23",
      sessionsCount: 6,
      diagnosis: "Couples Therapy",
      insurance: "Cigna",
    },
    {
      id: 5,
      name: "Lisa Rodriguez",
      email: "lisa.r@email.com",
      phone: "(555) 567-8901",
      status: "Pending",
      lastSession: null,
      nextSession: "2024-01-24",
      sessionsCount: 0,
      diagnosis: "Initial Assessment",
      insurance: "Medicare",
    },
  ];

  // Load clients data on mount
  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setClients(mockClients);
      } catch (err) {
        setError("Failed to load client data. Please try again.");
        toast({
          variant: "destructive",
          title: "Error Loading Clients",
          description: "There was a problem loading client data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, [toast]);

  // Computed values
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const clientStats: ClientStats = {
    total: clients.length,
    active: clients.filter((c) => c.status === "Active").length,
    newThisMonth: clients.filter((c) => c.status === "Pending").length,
    averageSessions:
      clients.length > 0
        ? Math.round(
            (clients.reduce((sum, c) => sum + c.sessionsCount, 0) /
              clients.length) *
              10,
          ) / 10
        : 0,
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
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

  const handleEditClient = useCallback(
    (client: Client) => {
      showModal({
        type: "info",
        title: "Edit Client",
        message: `Editing ${client.name}. In a full app, this would open an edit form with pre-filled data.`,
        confirmLabel: "Got it",
        onConfirm: () => {
          toast({
            title: "Edit Mode",
            description: `Edit functionality for ${client.name} would be implemented here.`,
          });
        },
      });
    },
    [showModal, toast],
  );

  const handleExportClients = useCallback(() => {
    try {
      const csvContent = filteredClients
        .map(
          (client) =>
            `"${client.name}","${client.email}","${client.phone}","${client.status}","${client.insurance}","${client.diagnosis}","${client.sessionsCount}"`,
        )
        .join("\n");
      const header = "Name,Email,Phone,Status,Insurance,Diagnosis,Sessions\n";
      const blob = new Blob([header + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `clients-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${filteredClients.length} clients to CSV file.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export client data. Please try again.",
      });
    }
  }, [filteredClients, toast]);

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading clients...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold">
              Client Management
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your client information and track their progress
            </p>
          </div>
          <Button
            onClick={() => setNewClientModalOpen(true)}
            className="shrink-0"
            aria-label="Add new client"
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add New Client
          </Button>
        </div>

        {/* Stats Cards */}
        <div
          className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4"
          role="region"
          aria-label="Client statistics"
        >
          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                Total Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-xl sm:text-2xl font-bold"
                aria-label={`${clientStats.total} total clients`}
              >
                {clientStats.total}
              </div>
              <p className="text-xs text-muted-foreground">
                +{clientStats.newThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  aria-hidden="true"
                />
                Active Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-xl sm:text-2xl font-bold"
                aria-label={`${clientStats.active} active clients`}
              >
                {clientStats.active}
              </div>
              <p className="text-xs text-muted-foreground">
                {clientStats.total > 0
                  ? Math.round((clientStats.active / clientStats.total) * 100)
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-yellow-500 rounded-full"
                  aria-hidden="true"
                />
                New This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-xl sm:text-2xl font-bold"
                aria-label={`${clientStats.newThisMonth} new clients this month`}
              >
                {clientStats.newThisMonth}
              </div>
              <p className="text-xs text-muted-foreground">pending intake</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-xl sm:text-2xl font-bold"
                aria-label={`${clientStats.averageSessions} average sessions per client`}
              >
                {clientStats.averageSessions}
              </div>
              <p className="text-xs text-muted-foreground">per client</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="therapease-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                    aria-hidden="true"
                  />
                  <Input
                    placeholder="Search clients by name, email, or diagnosis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    aria-label="Search clients"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      aria-label={`Filter by status: currently ${statusFilter}`}
                    >
                      <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
                      Status: {statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("All")}>
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Active")}>
                      Active Only
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("Inactive")}
                    >
                      Inactive Only
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("Pending")}
                    >
                      Pending Only
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  onClick={handleExportClients}
                  disabled={filteredClients.length === 0}
                  aria-label={`Export ${filteredClients.length} clients to CSV`}
                >
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Export ({filteredClients.length})
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Last Session</TableHead>
                    <TableHead>Next Session</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {client.diagnosis}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="mr-1 h-3 w-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="mr-1 h-3 w-3" />
                            {client.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {client.sessionsCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.lastSession ? (
                          <div className="text-sm">
                            {new Date(client.lastSession).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {client.nextSession ? (
                          <div className="text-sm">
                            {new Date(client.nextSession).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{client.insurance}</div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedClient(client);
                                setClientDetailModalOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                alert(
                                  `Editing ${client.name}. In a full app, this would open an edit form.`,
                                );
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Client
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigate("/sessions")}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Session
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
                <p className="text-muted-foreground">No clients found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <NewClientModal
        open={newClientModalOpen}
        onOpenChange={setNewClientModalOpen}
      />
      <ClientDetailModal
        open={clientDetailModalOpen}
        onOpenChange={setClientDetailModalOpen}
        client={selectedClient}
      />
    </Layout>
  );
};

export default Clients;
