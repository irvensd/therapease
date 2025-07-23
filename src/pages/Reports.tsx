import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  FileText,
  Heart,
  Zap,
  Filter,
  RefreshCw,
} from "lucide-react";

// Types for analytics data
interface PracticeMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalClients: number;
  clientGrowth: number;
  totalSessions: number;
  sessionGrowth: number;
  averageSessionRate: number;
  completionRate: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  sessions: number;
  newClients: number;
}

interface ClientOutcome {
  clientName: string;
  diagnosis: string;
  sessionsCompleted: number;
  initialScore: number;
  currentScore: number;
  improvement: number;
  status: "Improving" | "Stable" | "Declining";
}

interface SessionAnalytics {
  type: string;
  count: number;
  percentage: number;
  averageDuration: number;
  completionRate: number;
}

interface FinancialBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("3months");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [isMobile, setIsMobile] = useState(false);

  // Mock analytics data
  const [analyticsData] = useState({
    metrics: {
      totalRevenue: 45750,
      revenueGrowth: 12.5,
      totalClients: 48,
      clientGrowth: 8.3,
      totalSessions: 156,
      sessionGrowth: 15.2,
      averageSessionRate: 120,
      completionRate: 94.2,
    } as PracticeMetrics,

    revenueData: [
      { month: "Sep", revenue: 12800, sessions: 45, newClients: 8 },
      { month: "Oct", revenue: 15200, sessions: 52, newClients: 12 },
      { month: "Nov", revenue: 17750, sessions: 58, newClients: 15 },
      { month: "Dec", revenue: 19500, sessions: 62, newClients: 18 },
      { month: "Jan", revenue: 21200, sessions: 68, newClients: 22 },
      { month: "Feb", revenue: 18900, sessions: 59, newClients: 16 },
    ] as RevenueData[],

    clientOutcomes: [
      {
        clientName: "Emma Thompson",
        diagnosis: "Generalized Anxiety",
        sessionsCompleted: 12,
        initialScore: 18,
        currentScore: 8,
        improvement: 55.6,
        status: "Improving" as const,
      },
      {
        clientName: "Michael Chen",
        diagnosis: "Relationship Issues",
        sessionsCompleted: 8,
        initialScore: 22,
        currentScore: 12,
        improvement: 45.5,
        status: "Improving" as const,
      },
      {
        clientName: "Sarah Johnson",
        diagnosis: "Depression",
        sessionsCompleted: 15,
        initialScore: 24,
        currentScore: 9,
        improvement: 62.5,
        status: "Improving" as const,
      },
      {
        clientName: "David Wilson",
        diagnosis: "Teen Behavioral",
        sessionsCompleted: 5,
        initialScore: 16,
        currentScore: 14,
        improvement: 12.5,
        status: "Stable" as const,
      },
      {
        clientName: "Lisa Park",
        diagnosis: "PTSD",
        sessionsCompleted: 22,
        initialScore: 28,
        currentScore: 6,
        improvement: 78.6,
        status: "Improving" as const,
      },
    ] as ClientOutcome[],

    sessionAnalytics: [
      {
        type: "Individual Therapy",
        count: 98,
        percentage: 62.8,
        averageDuration: 55,
        completionRate: 96.9,
      },
      {
        type: "Couples Therapy",
        count: 32,
        percentage: 20.5,
        averageDuration: 75,
        completionRate: 93.8,
      },
      {
        type: "Family Therapy",
        count: 18,
        percentage: 11.5,
        averageDuration: 65,
        completionRate: 88.9,
      },
      {
        type: "Group Therapy",
        count: 8,
        percentage: 5.1,
        averageDuration: 90,
        completionRate: 100,
      },
    ] as SessionAnalytics[],

    financialBreakdown: [
      {
        category: "Session Fees",
        amount: 38400,
        percentage: 84,
        color: "#0086b3",
      },
      {
        category: "Late Fees",
        amount: 1200,
        percentage: 2.6,
        color: "#f59e0b",
      },
      {
        category: "No-Show Fees",
        amount: 800,
        percentage: 1.7,
        color: "#ef4444",
      },
      {
        category: "Insurance",
        amount: 5350,
        percentage: 11.7,
        color: "#10b981",
      },
    ] as FinancialBreakdown[],
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Export functionality
  const handleExportReport = useCallback(
    (reportType: string) => {
      try {
        let csvContent = "";
        let filename = "";

        switch (reportType) {
          case "revenue":
            csvContent = [
              ["Month", "Revenue", "Sessions", "New Clients"],
              ...analyticsData.revenueData.map((d) => [
                d.month,
                d.revenue.toString(),
                d.sessions.toString(),
                d.newClients.toString(),
              ]),
            ]
              .map((row) => row.join(","))
              .join("\n");
            filename = `revenue-report-${selectedPeriod}`;
            break;

          case "outcomes":
            csvContent = [
              [
                "Client Name",
                "Diagnosis",
                "Sessions",
                "Initial Score",
                "Current Score",
                "Improvement %",
                "Status",
              ],
              ...analyticsData.clientOutcomes.map((c) => [
                c.clientName,
                c.diagnosis,
                c.sessionsCompleted.toString(),
                c.initialScore.toString(),
                c.currentScore.toString(),
                c.improvement.toFixed(1) + "%",
                c.status,
              ]),
            ]
              .map((row) => row.join(","))
              .join("\n");
            filename = `client-outcomes-${selectedPeriod}`;
            break;

          case "sessions":
            csvContent = [
              [
                "Session Type",
                "Count",
                "Percentage",
                "Avg Duration (min)",
                "Completion Rate %",
              ],
              ...analyticsData.sessionAnalytics.map((s) => [
                s.type,
                s.count.toString(),
                s.percentage.toFixed(1) + "%",
                s.averageDuration.toString(),
                s.completionRate.toFixed(1) + "%",
              ]),
            ]
              .map((row) => row.join(","))
              .join("\n");
            filename = `session-analytics-${selectedPeriod}`;
            break;

          default:
            throw new Error("Unknown report type");
        }

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Export Successful",
          description: `${reportType} report exported successfully.`,
        });
      } catch (error) {
        toast({
          title: "Export Failed",
          description:
            "There was an error exporting the report. Please try again.",
          variant: "destructive",
        });
      }
    },
    [selectedPeriod, analyticsData, toast],
  );

  const getOutcomeStatusColor = (status: ClientOutcome["status"]) => {
    switch (status) {
      case "Improving":
        return "default";
      case "Stable":
        return "secondary";
      case "Declining":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 40)
      return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (improvement > 10) return <Activity className="h-3 w-3 text-blue-600" />;
    return <TrendingDown className="h-3 w-3 text-orange-600" />;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Generating reports...</span>
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
              <BarChart3 className="h-8 w-8" />
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">
              Track practice performance and client outcomes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analyticsData.metrics.totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />+
                {analyticsData.metrics.revenueGrowth}% from last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Clients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.metrics.totalClients}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />+
                {analyticsData.metrics.clientGrowth}% growth
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sessions
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.metrics.totalSessions}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />+
                {analyticsData.metrics.sessionGrowth}% increase
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.metrics.completionRate}%
              </div>
              <Progress
                value={analyticsData.metrics.completionRate}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="clinical">Clinical</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Revenue Trend</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportReport("revenue")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [
                          `$${value.toLocaleString()}`,
                          "Revenue",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#0086b3"
                        fill="#0086b3"
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Session Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Session Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.sessionAnalytics}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#0086b3"
                        dataKey="count"
                        label={({ type, percentage }) =>
                          `${type}: ${percentage.toFixed(1)}%`
                        }
                      >
                        {analyticsData.sessionAnalytics.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(${200 + index * 30}, 70%, ${50 + index * 10}%)`}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Session Types Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Session Analytics</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport("sessions")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session Type</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Avg Duration</TableHead>
                      <TableHead>Completion Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.sessionAnalytics.map((session, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {session.type}
                        </TableCell>
                        <TableCell>{session.count}</TableCell>
                        <TableCell>{session.percentage.toFixed(1)}%</TableCell>
                        <TableCell>{session.averageDuration} min</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{session.completionRate.toFixed(1)}%</span>
                            <Progress
                              value={session.completionRate}
                              className="w-16"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.financialBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="amount"
                        label={({ category, percentage }) =>
                          `${category}: ${percentage}%`
                        }
                      >
                        {analyticsData.financialBreakdown.map(
                          (entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ),
                        )}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) =>
                          `$${value.toLocaleString()}`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="#0086b3" name="Sessions" />
                      <Bar
                        dataKey="newClients"
                        fill="#10b981"
                        name="New Clients"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Financial Breakdown Table */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Share</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.financialBreakdown.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.category}
                        </TableCell>
                        <TableCell>${item.amount.toLocaleString()}</TableCell>
                        <TableCell>{item.percentage}%</TableCell>
                        <TableCell>
                          <Progress value={item.percentage} className="w-20" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clinical Tab */}
          <TabsContent value="clinical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Session Rate
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${analyticsData.metrics.averageSessionRate}
                  </div>
                  <p className="text-xs text-muted-foreground">Per session</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    No-Show Rate
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5.8%</div>
                  <p className="text-xs text-muted-foreground">Below average</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Sessions/Client
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.25</div>
                  <p className="text-xs text-muted-foreground">This period</p>
                </CardContent>
              </Card>
            </div>

            {/* Clinical Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Clinical Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analyticsData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sessions"
                      stroke="#0086b3"
                      name="Sessions"
                    />
                    <Line
                      type="monotone"
                      dataKey="newClients"
                      stroke="#10b981"
                      name="New Clients"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outcomes Tab */}
          <TabsContent value="outcomes" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Client Outcome Tracking</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport("outcomes")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Initial Score</TableHead>
                      <TableHead>Current Score</TableHead>
                      <TableHead>Improvement</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.clientOutcomes.map((outcome, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {outcome.clientName}
                        </TableCell>
                        <TableCell>{outcome.diagnosis}</TableCell>
                        <TableCell>{outcome.sessionsCompleted}</TableCell>
                        <TableCell>{outcome.initialScore}</TableCell>
                        <TableCell>{outcome.currentScore}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getImprovementIcon(outcome.improvement)}
                            <span>{outcome.improvement.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getOutcomeStatusColor(outcome.status)}
                          >
                            {outcome.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Outcome Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Clients Improving
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">4</div>
                  <p className="text-xs text-muted-foreground">
                    80% of active clients
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Improvement
                  </CardTitle>
                  <Award className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">50.8%</div>
                  <p className="text-xs text-muted-foreground">
                    Across all clients
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Treatment Success
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">94.2%</div>
                  <p className="text-xs text-muted-foreground">
                    Goal achievement rate
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
