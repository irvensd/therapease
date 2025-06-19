import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import Layout from "@/components/Layout";
import { NewClientModal } from "@/components/modals/NewClientModal";
import { AddReminderModal } from "@/components/modals/AddReminderModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [addReminderModalOpen, setAddReminderModalOpen] = useState(false);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Welcome section */}
        <div className="therapease-gradient rounded-xl p-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Dr. Wilson
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening in your practice today
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="therapease-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Clients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">
                +3 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">
                sessions scheduled
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">
                session attendance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's schedule and reminders */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Today's Sessions */}
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Today's Sessions
                <Badge variant="secondary">6 scheduled</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  time: "9:00 AM",
                  client: "Emma Thompson",
                  type: "Individual Therapy",
                  status: "confirmed",
                },
                {
                  time: "10:30 AM",
                  client: "Michael Chen",
                  type: "Couples Therapy",
                  status: "confirmed",
                },
                {
                  time: "2:00 PM",
                  client: "Sarah Johnson",
                  type: "Individual Therapy",
                  status: "pending",
                },
                {
                  time: "3:30 PM",
                  client: "David Wilson",
                  type: "Family Therapy",
                  status: "confirmed",
                },
              ].map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{session.client}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.time} • {session.type}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      session.status === "confirmed" ? "default" : "secondary"
                    }
                    className="capitalize"
                  >
                    {session.status}
                  </Badge>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/sessions")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Full Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Active Reminders */}
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Active Reminders
                <Badge variant="destructive">3 urgent</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Follow up with Emma Thompson",
                  description: "Session notes completion overdue",
                  priority: "high",
                  time: "2 hours ago",
                },
                {
                  title: "Insurance authorization",
                  description: "Michael Chen - renewal needed",
                  priority: "high",
                  time: "1 day ago",
                },
                {
                  title: "Treatment plan review",
                  description: "Sarah Johnson - quarterly review",
                  priority: "medium",
                  time: "3 days ago",
                },
                {
                  title: "Appointment confirmation",
                  description: "David Wilson - next week",
                  priority: "low",
                  time: "5 days ago",
                },
              ].map((reminder, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30"
                >
                  <div
                    className={`flex items-center justify-center w-2 h-2 rounded-full mt-2 ${
                      reminder.priority === "high"
                        ? "bg-destructive"
                        : reminder.priority === "medium"
                          ? "bg-accent"
                          : "bg-muted-foreground"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{reminder.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {reminder.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {reminder.time}
                    </p>
                  </div>
                  <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setAddReminderModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Reminder
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setNewClientModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Client
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate("/sessions")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Session
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate("/invoices")}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate("/clients")}
              >
                <Users className="mr-2 h-4 w-4" />
                View All Clients
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card className="therapease-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Sessions Completed</span>
                  <span>18/25 (72%)</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Notes Documented</span>
                  <span>16/18 (89%)</span>
                </div>
                <Progress value={89} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Invoices Sent</span>
                  <span>12/18 (67%)</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Great week! You're ahead of schedule on documentation and just
                  need to catch up on invoicing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <NewClientModal
        open={newClientModalOpen}
        onOpenChange={setNewClientModalOpen}
      />
      <AddReminderModal
        open={addReminderModalOpen}
        onOpenChange={setAddReminderModalOpen}
      />
    </Layout>
  );
};

export default Dashboard;
