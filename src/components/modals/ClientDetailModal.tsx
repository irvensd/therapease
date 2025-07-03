import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AIAssistant } from "@/components/AIAssistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  DollarSign,
  Clock,
  Edit,
} from "lucide-react";

interface ClientDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
    lastSession: string | null;
    nextSession: string | null;
    sessionsCount: number;
    diagnosis: string;
    insurance: string;
  } | null;
}

export function ClientDetailModal({
  open,
  onOpenChange,
  client,
}: ClientDetailModalProps) {
  if (!client) return null;

  const mockSessions = [
    {
      date: "2024-01-15",
      type: "Individual Therapy",
      duration: "60 min",
      notes:
        "Client showed significant progress with anxiety management techniques.",
      status: "Completed",
    },
    {
      date: "2024-01-08",
      type: "Individual Therapy",
      duration: "60 min",
      notes: "Discussed coping strategies and homework assignments.",
      status: "Completed",
    },
    {
      date: "2024-01-01",
      type: "Individual Therapy",
      duration: "60 min",
      notes: "Initial assessment and treatment planning session.",
      status: "Completed",
    },
  ];

  const mockInvoices = [
    { date: "2024-01-15", amount: "$150", status: "Paid" },
    { date: "2024-01-08", amount: "$150", status: "Paid" },
    { date: "2024-01-01", amount: "$200", status: "Pending" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {client.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  client.status === "Active"
                    ? "default"
                    : client.status === "Inactive"
                      ? "secondary"
                      : "outline"
                }
              >
                {client.status}
              </Badge>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="ai-insights">✨ AI Insights</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.phone}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Treatment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Primary Diagnosis
                    </span>
                    <p className="text-sm font-medium">{client.diagnosis}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Insurance
                    </span>
                    <p className="text-sm font-medium">{client.insurance}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Session Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Sessions</span>
                    <span className="font-medium">{client.sessionsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Session</span>
                    <span className="font-medium">
                      {client.lastSession
                        ? new Date(client.lastSession).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Next Session</span>
                    <span className="font-medium">
                      {client.nextSession
                        ? new Date(client.nextSession).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <div className="space-y-3">
              {mockSessions.map((session, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          <Badge variant="outline">{session.type}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {session.duration}
                          </span>
                        </div>
                        <p className="text-sm">{session.notes}</p>
                      </div>
                      <Badge
                        variant={
                          session.status === "Completed" ? "default" : "outline"
                        }
                      >
                        {session.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 mb-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Billing Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Billed</span>
                      <span className="font-medium">$500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Paid</span>
                      <span className="font-medium text-green-600">$300</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Outstanding</span>
                      <span className="font-medium text-accent">$200</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {mockInvoices.map((invoice, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">
                          {new Date(invoice.date).toLocaleDateString()}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Therapy Session
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{invoice.amount}</span>
                        <Badge
                          variant={
                            invoice.status === "Paid" ? "default" : "secondary"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Documents</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload treatment plans, assessments, and other documents
                </p>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
