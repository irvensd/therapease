import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { NewClientModal } from "@/components/modals/NewClientModal";
import { ClientProfileModal } from "@/components/ClientProfileModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  User,
  Users,
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
} from "lucide-react";

// Comprehensive mock client data
const mockClients = [
  {
    id: 1,
    // Personal Information
    firstName: "Emma",
    lastName: "Thompson",
    preferredName: "Emma",
    dateOfBirth: "1985-03-15",
    age: 38,
    gender: "Female",
    pronouns: "She/Her",
    maritalStatus: "Married",
    occupation: "Marketing Manager",
    employer: "TechCorp Inc.",
    
    // Contact Information
    email: "emma.thompson@email.com",
    phone: "(555) 123-4567",
    altPhone: "(555) 123-4568",
    address: {
      street: "123 Oak Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "USA"
    },
    
    // Emergency Contacts
    emergencyContacts: [
      {
        name: "James Thompson",
        relationship: "Spouse",
        phone: "(555) 123-4569",
        email: "james.thompson@email.com",
        isPrimary: true
      },
      {
        name: "Mary Johnson",
        relationship: "Sister",
        phone: "(555) 987-6543",
        email: "mary.j@email.com",
        isPrimary: false
      }
    ],
    
    // Insurance Information
    insurance: {
      primary: {
        provider: "Blue Cross Blue Shield",
        planName: "PPO Plus",
        policyNumber: "BC123456789",
        groupNumber: "GRP001",
        subscriberName: "Emma Thompson",
        subscriberId: "ET123456",
        copay: 25,
        deductible: 1500,
        deductibleMet: 800,
        coinsurance: 20,
        outOfPocketMax: 5000,
        outOfPocketMet: 1200,
        effectiveDate: "2024-01-01",
        expirationDate: "2024-12-31"
      },
      secondary: null
    },
    
    // Clinical Information
    status: "Active",
    therapistId: "dr-wilson",
    dateAdmitted: "2023-09-15",
    referralSource: "Psychology Today",
    presentingConcern: "Work-related anxiety and stress management",
    diagnosis: {
      primary: "F41.1 - Generalized Anxiety Disorder",
      secondary: "Z73.0 - Burn-out"
    },
    riskLevel: "Low",
    treatmentGoals: [
      "Reduce anxiety symptoms by 50%",
      "Develop healthy coping strategies",
      "Improve work-life balance"
    ],
    
    // Session Information
    sessionsCount: 12,
    lastSession: "2024-11-22",
    nextSession: "2024-11-29",
    sessionFrequency: "Weekly",
    preferredSessionType: "In-Person",
    
    // Family/Relationships
    familyMembers: [
      {
        name: "James Thompson",
        relationship: "Spouse",
        age: 40,
        isInTreatment: false,
        notes: "Supportive partner, occasionally attends sessions"
      },
      {
        name: "Sophie Thompson", 
        relationship: "Daughter",
        age: 12,
        isInTreatment: false,
        notes: "Well-adjusted, aware of mom's therapy"
      }
    ],
    
    // Assessment Scores
    assessments: [
      {
        name: "GAD-7",
        score: 8,
        severity: "Mild",
        date: "2024-11-15",
        baseline: 15
      },
      {
        name: "PHQ-9",
        score: 6,
        severity: "Mild", 
        date: "2024-11-15",
        baseline: 12
      }
    ],
    
    // Progress Tracking
    progressNotes: [
      {
        date: "2024-11-22",
        session: 12,
        mood: "Improved",
        progressRating: 7,
        keyTopics: ["Cognitive restructuring", "Work boundaries"],
        homework: "Practice breathing exercises daily"
      },
      {
        date: "2024-11-15", 
        session: 11,
        mood: "Anxious",
        progressRating: 6,
        keyTopics: ["Stress management", "Time management"],
        homework: "Complete thought record worksheet"
      }
    ],
    
    // Billing
    billingInfo: {
      preferredPayment: "Insurance + Copay",
      creditCard: {
        lastFour: "4567",
        type: "Visa",
        expiry: "12/26"
      },
      balance: 0,
      lastPayment: "2024-11-22",
      paymentHistory: [
        { date: "2024-11-22", amount: 25, type: "Copay" },
        { date: "2024-11-15", amount: 25, type: "Copay" }
      ]
    },
    
    // Client Portal Access
    portalAccess: {
      isEnabled: true,
      lastLogin: "2024-11-20",
      hasUnreadMessages: true,
      upcomingAppointments: 1,
      pendingForms: 0
    }
  },
  
  // Additional clients (condensed for space)
  {
    id: 2,
    firstName: "Michael",
    lastName: "Chen", 
    preferredName: "Mike",
    dateOfBirth: "1982-07-22",
    age: 41,
    gender: "Male",
    pronouns: "He/Him",
    maritalStatus: "Married",
    occupation: "Software Engineer",
    email: "michael.chen@email.com",
    phone: "(555) 234-5678",
    address: {
      street: "456 Pine Avenue",
      city: "San Francisco", 
      state: "CA",
      zipCode: "94103",
      country: "USA"
    },
    emergencyContacts: [
      {
        name: "Lisa Chen",
        relationship: "Spouse",
        phone: "(555) 234-5679",
        email: "lisa.chen@email.com",
        isPrimary: true
      }
    ],
    insurance: {
      primary: {
        provider: "Aetna",
        planName: "HMO",
        policyNumber: "AET987654321",
        copay: 30,
        deductible: 2000,
        deductibleMet: 1200
      }
    },
    status: "Active",
    presentingConcern: "Couples communication issues",
    diagnosis: {
      primary: "Z63.0 - Problems in relationship with spouse"
    },
    sessionsCount: 8,
    lastSession: "2024-11-21",
    nextSession: "2024-11-28",
    riskLevel: "Low",
    familyMembers: [
      {
        name: "Lisa Chen",
        relationship: "Spouse", 
        age: 38,
        isInTreatment: true,
        notes: "Joint couples therapy sessions"
      }
    ],
    assessments: [
      {
        name: "DAS-32",
        score: 85,
        severity: "Moderate Distress",
        date: "2024-11-01"
      }
    ],
    portalAccess: {
      isEnabled: true,
      lastLogin: "2024-11-19",
      hasUnreadMessages: false,
      upcomingAppointments: 1,
      pendingForms: 1
    }
  },
  
  {
    id: 3,
    firstName: "Sarah",
    lastName: "Johnson",
    preferredName: "Sarah",
    dateOfBirth: "1990-12-03",
    age: 33,
    gender: "Female", 
    pronouns: "She/Her",
    maritalStatus: "Single",
    occupation: "Teacher",
    email: "sarah.johnson@email.com",
    phone: "(555) 345-6789",
    address: {
      street: "789 Elm Street",
      city: "Oakland",
      state: "CA", 
      zipCode: "94601",
      country: "USA"
    },
    emergencyContacts: [
      {
        name: "Robert Johnson",
        relationship: "Father",
        phone: "(555) 345-6790",
        email: "rob.johnson@email.com",
        isPrimary: true
      }
    ],
    insurance: {
      primary: {
        provider: "United Healthcare",
        planName: "Choice Plus",
        policyNumber: "UHC456789123",
        copay: 20,
        deductible: 1000,
        deductibleMet: 1000
      }
    },
    status: "Completed",
    presentingConcern: "Depression and self-esteem issues",
    diagnosis: {
      primary: "F32.1 - Major Depressive Disorder, Moderate"
    },
    sessionsCount: 24,
    lastSession: "2024-10-15",
    nextSession: null,
    riskLevel: "Low",
    familyMembers: [
      {
        name: "Robert Johnson",
        relationship: "Father",
        age: 65,
        isInTreatment: false,
        notes: "Supportive family member"
      }
    ],
    assessments: [
      {
        name: "PHQ-9", 
        score: 3,
        severity: "Minimal",
        date: "2024-10-15",
        baseline: 18
      }
    ],
    portalAccess: {
      isEnabled: false,
      lastLogin: "2024-10-15",
      hasUnreadMessages: false,
      upcomingAppointments: 0,
      pendingForms: 0
    }
  }
];

const Clients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch = 
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.presentingConcern.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600";
      case "Medium": return "text-yellow-600";
      case "High": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate statistics
  const totalClients = mockClients.length;
  const activeClients = mockClients.filter(c => c.status === "Active").length;
  const newThisMonth = mockClients.filter(c => {
    const admitted = new Date(c.dateAdmitted);
    const now = new Date();
    return admitted.getMonth() === now.getMonth() && admitted.getFullYear() === now.getFullYear();
  }).length;
  const avgSessions = Math.round(mockClients.reduce((sum, c) => sum + c.sessionsCount, 0) / totalClients * 10) / 10;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Client Management</h1>
            <p className="text-muted-foreground">
              Comprehensive client profiles with demographics, insurance, and family mapping
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/client-portal")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Client Portal
            </Button>
            <Button onClick={() => setNewClientModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Client
            </Button>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                  <p className="text-2xl font-bold">{totalClients}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                  <p className="text-2xl font-bold">{activeClients}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                  <p className="text-2xl font-bold">{newThisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Avg Sessions</p>
                  <p className="text-2xl font-bold">{avgSessions}</p>
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
                    placeholder="Search clients by name, email, or presenting concern..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Client Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {client.firstName} {client.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {client.preferredName !== client.firstName && `"${client.preferredName}" • `}
                        Age {client.age} • {client.pronouns}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{client.address.city}, {client.address.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>{client.insurance.primary.provider}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sessions:</span>
                    <span className="font-medium">{client.sessionsCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Risk Level:</span>
                    <span className={`font-medium ${getRiskColor(client.riskLevel)}`}>
                      {client.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next Session:</span>
                    <span className="font-medium">
                      {client.nextSession ? new Date(client.nextSession).toLocaleDateString() : "Not scheduled"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    <strong>Presenting Concern:</strong> {client.presentingConcern}
                  </p>
                  
                  {client.familyMembers && client.familyMembers.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span>Family: {client.familyMembers.length} member{client.familyMembers.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedClient(client)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-1 h-3 w-3" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No clients found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or add a new client.
              </p>
              <Button onClick={() => setNewClientModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Client
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* New Client Modal */}
      <NewClientModal
        open={newClientModalOpen}
        onOpenChange={setNewClientModalOpen}
      />

      {/* Client Profile Modal */}
      <ClientProfileModal
        open={!!selectedClient}
        onOpenChange={() => setSelectedClient(null)}
        client={selectedClient}
      />
    </Layout>
  );
};

export default Clients;
