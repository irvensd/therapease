import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Receipt,
  Plus,
  DollarSign,
  TrendingUp,
  Download,
  Search,
  Filter,
  Eye,
  Edit,
  Send,
  Trash2,
  MoreVertical,
  Loader2,
  AlertCircle,
  Calendar,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  StarOff,
} from "lucide-react";
import { CreateInvoiceModal } from "@/components/modals/CreateInvoiceModal";
import { SendInvoiceModal } from "@/components/modals/SendInvoiceModal";

// Types for better type safety
interface Invoice {
  id: number;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  services: InvoiceService[];
  notes?: string;
  isStarred: boolean;
  paymentMethod?: string;
  lateFee?: number;
  discountAmount?: number;
  taxAmount: number;
  totalAmount: number;
}

interface InvoiceService {
  description: string;
  quantity: number;
  rate: number;
  total: number;
  date: string;
}

interface InvoiceStats {
  totalInvoices: number;
  totalRevenue: number;
  outstandingAmount: number;
  paidThisMonth: number;
  overdueCount: number;
  averagePaymentTime: number;
  collectionRate: number;
}

const Invoices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showModal, ModalComponent } = useConfirmationModal();

  // State management
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createInvoiceModalOpen, setCreateInvoiceModalOpen] = useState(false);
  const [sendInvoiceModalOpen, setSendInvoiceModalOpen] = useState(false);
  const [invoiceToSend, setInvoiceToSend] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [clientFilter, setClientFilter] = useState("all");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Mock invoice data - in real app would be fetched from API
  const mockInvoices: Invoice[] = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      clientName: "Emma Thompson",
      clientEmail: "emma.t@email.com",
      amount: 600,
      status: "Paid",
      issueDate: "2024-01-15",
      dueDate: "2024-01-30",
      paidDate: "2024-01-28",
      services: [
        {
          description: "Individual Therapy Session - Anxiety Treatment",
          quantity: 4,
          rate: 150,
          total: 600,
          date: "2024-01-15",
        },
      ],
      notes: "Payment received via credit card",
      isStarred: false,
      paymentMethod: "Credit Card",
      taxAmount: 0,
      totalAmount: 600,
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      clientName: "Michael Chen",
      clientEmail: "m.chen@email.com",
      amount: 450,
      status: "Sent",
      issueDate: "2024-01-14",
      dueDate: "2024-01-29",
      services: [
        {
          description: "Couples Therapy Session",
          quantity: 3,
          rate: 180,
          total: 540,
          date: "2024-01-14",
        },
      ],
      notes: "Insurance pre-authorization approved",
      isStarred: true,
      discountAmount: 90,
      taxAmount: 0,
      totalAmount: 450,
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      clientName: "Sarah Johnson",
      clientEmail: "sarah.j@email.com",
      amount: 750,
      status: "Overdue",
      issueDate: "2024-01-10",
      dueDate: "2024-01-25",
      services: [
        {
          description: "EMDR Therapy Session - PTSD Treatment",
          quantity: 5,
          rate: 170,
          total: 850,
          date: "2024-01-10",
        },
      ],
      notes: "Second notice sent",
      isStarred: true,
      lateFee: 25,
      discountAmount: 100,
      taxAmount: 0,
      totalAmount: 775,
    },
    {
      id: 4,
      invoiceNumber: "INV-2024-004",
      clientName: "David Wilson",
      clientEmail: "d.wilson@email.com",
      amount: 300,
      status: "Paid",
      issueDate: "2024-01-12",
      dueDate: "2024-01-27",
      paidDate: "2024-01-26",
      services: [
        {
          description: "Family Therapy Session",
          quantity: 2,
          rate: 200,
          total: 400,
          date: "2024-01-12",
        },
      ],
      notes: "Early payment discount applied",
      isStarred: false,
      paymentMethod: "Bank Transfer",
      discountAmount: 100,
      taxAmount: 0,
      totalAmount: 300,
    },
    {
      id: 5,
      invoiceNumber: "INV-2024-005",
      clientName: "Lisa Rodriguez",
      clientEmail: "lisa.r@email.com",
      amount: 480,
      status: "Draft",
      issueDate: "2024-01-20",
      dueDate: "2024-02-05",
      services: [
        {
          description: "Initial Assessment & Treatment Planning",
          quantity: 1,
          rate: 200,
          total: 200,
          date: "2024-01-18",
        },
        {
          description: "Individual Therapy Session - Depression",
          quantity: 2,
          rate: 150,
          total: 300,
          date: "2024-01-20",
        },
      ],
      notes: "Awaiting insurance verification",
      isStarred: false,
      taxAmount: 20,
      totalAmount: 500,
    },
    {
      id: 6,
      invoiceNumber: "INV-2024-006",
      clientName: "Robert Kim",
      clientEmail: "robert.k@email.com",
      amount: 540,
      status: "Sent",
      issueDate: "2024-01-21",
      dueDate: "2024-02-05",
      services: [
        {
          description: "Cognitive Behavioral Therapy - 3 Sessions",
          quantity: 3,
          rate: 160,
          total: 480,
          date: "2024-01-21",
        },
      ],
      notes: "Client requested payment plan",
      isStarred: false,
      taxAmount: 60,
      totalAmount: 540,
    },
  ];

  // Load invoices data on mount
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setInvoices(mockInvoices);
      } catch (err) {
        setError("Failed to load invoice data. Please try again.");
        toast({
          variant: "destructive",
          title: "Error Loading Invoices",
          description: "There was a problem loading your invoices.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, [toast]);

  // Memoized computed values to prevent infinite loops
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === "active") {
        matchesStatus =
          invoice.status === "Draft" ||
          invoice.status === "Sent" ||
          invoice.status === "Overdue";
      } else if (statusFilter !== "all") {
        matchesStatus = invoice.status === statusFilter;
      }

      const matchesClient =
        clientFilter === "all" || invoice.clientName === clientFilter;
      const matchesStarred = !showStarredOnly || invoice.isStarred;

      return matchesSearch && matchesStatus && matchesClient && matchesStarred;
    });
  }, [invoices, searchTerm, statusFilter, clientFilter, showStarredOnly]);

  const invoiceStats: InvoiceStats = useMemo(() => {
    const paidInvoices = invoices.filter((i) => i.status === "Paid");
    const overdueInvoices = invoices.filter((i) => i.status === "Overdue");
    const outstandingInvoices = invoices.filter(
      (i) => i.status === "Sent" || i.status === "Overdue",
    );

    const thisMonth = new Date().toISOString().slice(0, 7);
    const paidThisMonth = paidInvoices
      .filter((i) => i.paidDate?.startsWith(thisMonth))
      .reduce((sum, i) => sum + i.totalAmount, 0);

    return {
      totalInvoices: invoices.length,
      totalRevenue: paidInvoices.reduce((sum, i) => sum + i.totalAmount, 0),
      outstandingAmount: outstandingInvoices.reduce(
        (sum, i) => sum + i.totalAmount,
        0,
      ),
      paidThisMonth,
      overdueCount: overdueInvoices.length,
      averagePaymentTime: 12, // Mock value - would be calculated from actual payment data
      collectionRate:
        invoices.length > 0
          ? Math.round((paidInvoices.length / invoices.length) * 100)
          : 0,
    };
  }, [invoices]);

  const uniqueClients = useMemo(() => {
    return Array.from(new Set(invoices.map((i) => i.clientName))).sort();
  }, [invoices]);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "Cancelled":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="h-3 w-3" />;
      case "Sent":
        return <Send className="h-3 w-3" />;
      case "Overdue":
        return <AlertCircle className="h-3 w-3" />;
      case "Draft":
        return <FileText className="h-3 w-3" />;
      case "Cancelled":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  // Action handlers with proper error handling
  const handleToggleStar = useCallback(
    (invoiceId: number) => {
      setInvoices((prev) => {
        const updated = prev.map((invoice) =>
          invoice.id === invoiceId
            ? { ...invoice, isStarred: !invoice.isStarred }
            : invoice,
        );

        const updatedInvoice = updated.find((i) => i.id === invoiceId);
        if (updatedInvoice) {
          toast({
            title: updatedInvoice.isStarred
              ? "Added to Starred"
              : "Removed from Starred",
            description: `Invoice ${updatedInvoice.invoiceNumber} ${updatedInvoice.isStarred ? "added to" : "removed from"} starred invoices.`,
          });
        }

        return updated;
      });
    },
    [toast],
  );

  const handleViewInvoice = useCallback(
    (invoice: Invoice) => {
      const modalMessage = [
        `Invoice: ${invoice.invoiceNumber}`,
        `Client: ${invoice.clientName} (${invoice.clientEmail})`,
        `Amount: $${invoice.amount.toLocaleString()}`,
        `Status: ${invoice.status}`,
        `Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`,
        `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
        invoice.paidDate
          ? `Paid Date: ${new Date(invoice.paidDate).toLocaleDateString()}`
          : "",
        `Services: ${invoice.services.length} item(s)`,
        invoice.paymentMethod ? `Payment Method: ${invoice.paymentMethod}` : "",
        invoice.notes ? `Notes: ${invoice.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      showModal({
        type: "info",
        title: `Invoice Details`,
        message: modalMessage,
        confirmLabel: "Close",
      });
    },
    [showModal],
  );

  const handleSendInvoice = useCallback((invoice: Invoice) => {
    setInvoiceToSend(invoice);
    setSendInvoiceModalOpen(true);
  }, []);

  const handleInvoiceSent = useCallback((invoiceId: number) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === invoiceId
          ? { ...invoice, status: "Sent" as const }
          : invoice,
      ),
    );
  }, []);

  const handleMarkAsPaid = useCallback(
    (invoice: Invoice) => {
      showModal({
        type: "success",
        title: "Mark Invoice as Paid",
        message: `Mark invoice ${invoice.invoiceNumber} for ${invoice.clientName} ($${invoice.totalAmount.toLocaleString()}) as paid?`,
        confirmLabel: "Mark as Paid",
        cancelLabel: "Cancel",
        showCancel: true,
        onConfirm: () => {
          setInvoices((prev) =>
            prev.map((i) =>
              i.id === invoice.id
                ? {
                    ...i,
                    status: "Paid" as const,
                    paidDate: new Date().toISOString().split("T")[0],
                  }
                : i,
            ),
          );

          toast({
            title: "Payment Recorded",
            description: `Invoice ${invoice.invoiceNumber} has been marked as paid.`,
          });
        },
      });
    },
    [showModal, toast],
  );

  const handleDeleteInvoice = useCallback(
    (invoice: Invoice) => {
      showModal({
        type: "destructive",
        title: "Delete Invoice",
        message: `Are you sure you want to permanently delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`,
        confirmLabel: "Delete Invoice",
        cancelLabel: "Cancel",
        showCancel: true,
        onConfirm: () => {
          setInvoices((prev) => prev.filter((i) => i.id !== invoice.id));
          toast({
            title: "Invoice Deleted",
            description: `Invoice ${invoice.invoiceNumber} has been permanently deleted.`,
          });
        },
      });
    },
    [showModal, toast],
  );

  const handleExportInvoices = useCallback(() => {
    try {
      const csvHeaders = [
        "Invoice Number",
        "Client Name",
        "Client Email",
        "Amount",
        "Total Amount",
        "Status",
        "Issue Date",
        "Due Date",
        "Paid Date",
        "Payment Method",
        "Notes",
      ];

      const csvContent = filteredInvoices.map((invoice) =>
        [
          `"${invoice.invoiceNumber}"`,
          `"${invoice.clientName.replace(/"/g, '""')}"`,
          `"${invoice.clientEmail}"`,
          `"$${invoice.amount.toLocaleString()}"`,
          `"$${invoice.totalAmount.toLocaleString()}"`,
          `"${invoice.status}"`,
          `"${new Date(invoice.issueDate).toLocaleDateString()}"`,
          `"${new Date(invoice.dueDate).toLocaleDateString()}"`,
          `"${invoice.paidDate ? new Date(invoice.paidDate).toLocaleDateString() : ""}"`,
          `"${invoice.paymentMethod || ""}"`,
          `"${invoice.notes?.replace(/"/g, '""') || ""}"`,
        ].join(","),
      );

      const csvData = [csvHeaders.join(","), ...csvContent].join("\n");

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoices-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${filteredInvoices.length} invoices to CSV file.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export invoice data. Please try again.",
      });
    }
  }, [filteredInvoices, toast]);

  const handleInvoiceModalClose = useCallback((open: boolean) => {
    setCreateInvoiceModalOpen(open);
    if (!open) {
      setEditingInvoice(null);
    }
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading invoices...</p>
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
              Invoice Management
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Track billing, payments, and financial reporting
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleExportInvoices}
              disabled={filteredInvoices.length === 0}
              className="shrink-0"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV ({filteredInvoices.length})
            </Button>
            <Button
              onClick={() => {
                setEditingInvoice(null);
                setCreateInvoiceModalOpen(true);
              }}
              className="shrink-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                ${invoiceStats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {invoiceStats.collectionRate}% collection rate
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                Outstanding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-orange-600">
                ${invoiceStats.outstandingAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {invoiceStats.overdueCount} overdue
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                ${invoiceStats.paidThisMonth.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">payments received</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Receipt className="h-4 w-4 text-purple-600" />
                Total Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {invoiceStats.totalInvoices}
              </div>
              <Progress
                value={invoiceStats.collectionRate}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="therapease-card">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle>Invoice Management</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search invoices, clients, or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Button
                  variant={showStarredOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowStarredOnly(!showStarredOnly)}
                >
                  {showStarredOnly ? (
                    <Star className="h-4 w-4 fill-current" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {uniqueClients.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">
                        Invoice & Client
                      </TableHead>
                      <TableHead className="min-w-[120px] hidden sm:table-cell">
                        Dates
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        Amount & Status
                      </TableHead>
                      <TableHead className="min-w-[120px] hidden md:table-cell">
                        Services
                      </TableHead>
                      <TableHead className="min-w-[100px] hidden lg:table-cell">
                        Payment Info
                      </TableHead>
                      <TableHead className="w-[140px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow
                        key={invoice.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">
                                {invoice.invoiceNumber}
                              </div>
                              {invoice.isStarred && (
                                <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {invoice.clientName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {invoice.clientEmail}
                            </div>
                            {/* Mobile-only dates */}
                            <div className="sm:hidden mt-1 text-xs text-muted-foreground">
                              Due:{" "}
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="text-sm">
                            <div className="font-medium">
                              Issue:{" "}
                              {new Date(invoice.issueDate).toLocaleDateString()}
                            </div>
                            <div className="text-muted-foreground">
                              Due:{" "}
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </div>
                            {invoice.paidDate && (
                              <div className="text-green-600 text-xs">
                                Paid:{" "}
                                {new Date(
                                  invoice.paidDate,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-bold">
                              ${invoice.totalAmount.toLocaleString()}
                            </div>
                            <Badge
                              className={getStatusColor(invoice.status)}
                              variant="outline"
                            >
                              <span className="flex items-center gap-1">
                                {getStatusIcon(invoice.status)}
                                {invoice.status}
                              </span>
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">
                            <div className="font-medium">
                              {invoice.services.length} service(s)
                            </div>
                            <div className="text-muted-foreground">
                              {invoice.services.reduce(
                                (sum, s) => sum + s.quantity,
                                0,
                              )}{" "}
                              sessions
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-sm">
                            {invoice.paymentMethod && (
                              <div className="font-medium">
                                {invoice.paymentMethod}
                              </div>
                            )}
                            {invoice.lateFee && (
                              <div className="text-red-600 text-xs">
                                Late fee: ${invoice.lateFee}
                              </div>
                            )}
                            {invoice.discountAmount && (
                              <div className="text-green-600 text-xs">
                                Discount: -${invoice.discountAmount}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStar(invoice.id)}
                            >
                              {invoice.isStarred ? (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                            {invoice.status !== "Paid" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsPaid(invoice)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewInvoice(invoice)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleSendInvoice(invoice)}
                                >
                                  <Send className="mr-2 h-4 w-4" />
                                  {invoice.status === "Draft"
                                    ? "Send"
                                    : "Resend"}{" "}
                                  Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteInvoice(invoice)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {filteredInvoices.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-medium">
                  No invoices found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm ||
                  statusFilter !== "active" ||
                  clientFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first invoice to get started"}
                </p>
                {!searchTerm &&
                  statusFilter === "active" &&
                  clientFilter === "all" && (
                    <Button
                      className="mt-4"
                      onClick={() => setCreateInvoiceModalOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Invoice
                    </Button>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateInvoiceModal
        open={createInvoiceModalOpen}
        onOpenChange={handleInvoiceModalClose}
      />
      <SendInvoiceModal
        open={sendInvoiceModalOpen}
        onOpenChange={setSendInvoiceModalOpen}
        invoice={invoiceToSend}
        onInvoiceSent={handleInvoiceSent}
      />
      <ModalComponent />
    </Layout>
  );
};

export default Invoices;
