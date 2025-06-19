import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt, Plus, DollarSign, TrendingUp, Download } from "lucide-react";
import { CreateInvoiceModal } from "@/components/modals/CreateInvoiceModal";

const Invoices = () => {
  const [createInvoiceModalOpen, setCreateInvoiceModalOpen] = useState(false);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Invoice Management</h1>
            <p className="text-muted-foreground">
              Track billing, payments, and financial reporting
            </p>
          </div>
          <Button onClick={() => setCreateInvoiceModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">$3,240</div>
              <p className="text-xs text-muted-foreground">
                6 pending invoices
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Paid This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$9,210</div>
              <p className="text-xs text-muted-foreground">
                22 payments received
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Session Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$150</div>
              <p className="text-xs text-muted-foreground">
                individual therapy
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Invoices
                <Badge variant="outline">6 pending</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: "INV-2024-001",
                  client: "Emma Thompson",
                  amount: "$600",
                  status: "Paid",
                  date: "Jan 15, 2024",
                },
                {
                  id: "INV-2024-002",
                  client: "Michael Chen",
                  amount: "$450",
                  status: "Pending",
                  date: "Jan 14, 2024",
                },
                {
                  id: "INV-2024-003",
                  client: "Sarah Johnson",
                  amount: "$750",
                  status: "Overdue",
                  date: "Jan 10, 2024",
                },
                {
                  id: "INV-2024-004",
                  client: "David Wilson",
                  amount: "$300",
                  status: "Paid",
                  date: "Jan 12, 2024",
                },
              ].map((invoice, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Receipt className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{invoice.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {invoice.client} • {invoice.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{invoice.amount}</p>
                    <Badge
                      variant={
                        invoice.status === "Paid"
                          ? "default"
                          : invoice.status === "Overdue"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  alert(
                    "Invoice management dashboard coming soon! You'll be able to view, edit, send, and track all invoices.",
                  );
                }}
              >
                <Receipt className="mr-2 h-4 w-4" />
                View All Invoices
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Revenue (YTD)</span>
                  <span className="font-medium">$124,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Outstanding Payments</span>
                  <span className="font-medium text-accent">$3,240</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Collection Rate</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Payment Time</span>
                  <span className="font-medium">12 days</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // Generate sample financial report
                    const reportData = `Financial Report - ${new Date().toLocaleDateString()}

Total Revenue (YTD): $124,500
Outstanding Payments: $3,240
Collection Rate: 94%
Average Payment Time: 12 days

Monthly Breakdown:
January: $12,450
December: $11,200
November: $10,800`;

                    const blob = new Blob([reportData], { type: "text/plain" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "financial-report.txt";
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    alert(
                      "Payment settings coming soon! Configure payment methods, late fees, and automated reminders.",
                    );
                  }}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Payment Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="therapease-card">
          <CardHeader>
            <CardTitle>Billing Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Automated Billing</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically generate invoices based on completed sessions
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Insurance Claims</h4>
                <p className="text-sm text-muted-foreground">
                  Direct integration with major insurance providers
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Payment Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Secure online payment portal for clients
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Financial Reports</h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive reporting for tax and business analysis
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Late Payment Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Automated reminders and overdue notifications
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Tax Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Export data for popular accounting software
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Invoices;
