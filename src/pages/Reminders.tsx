import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { AddReminderModal } from "@/components/modals/AddReminderModal";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";

const Reminders = () => {
  const [addReminderModalOpen, setAddReminderModalOpen] = useState(false);
  const { showModal, ModalComponent } = useConfirmationModal();
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Follow up with Emma Thompson",
      description: "Session notes completion overdue",
      time: "2 hours ago",
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      title: "Insurance authorization",
      description: "Michael Chen - renewal needed",
      time: "1 day ago",
      priority: "high",
      completed: false,
    },
    {
      id: 3,
      title: "Treatment plan review",
      description: "Sarah Johnson - quarterly review",
      time: "3 days ago",
      priority: "high",
      completed: false,
    },
  ]);

  const completeReminder = (id: number) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id ? { ...reminder, completed: true } : reminder,
      ),
    );
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reminders</h1>
            <p className="text-muted-foreground">
              Stay on top of important tasks and deadlines
            </p>
          </div>
          <Button onClick={() => setAddReminderModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Reminder
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">3</div>
              <p className="text-xs text-muted-foreground">urgent reminders</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">due today</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">upcoming</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Urgent Reminders
                <Badge variant="destructive">3</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reminders
                .filter((r) => !r.completed)
                .map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                  >
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{reminder.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {reminder.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {reminder.time}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const completionMessage = reminder.title.includes(
                          "Emma",
                        )
                          ? "Session notes for Emma Thompson have been completed and filed securely in her client record."
                          : reminder.title.includes("Insurance")
                            ? "Insurance authorization reminder completed. Michael Chen's renewal has been processed and documentation updated."
                            : "Treatment plan review has been scheduled for Sarah Johnson next week. Calendar updated with appointment details.";

                        showModal({
                          type: "success",
                          title: "Task Completed Successfully! ✅",
                          message: completionMessage,
                          confirmLabel: "Great!",
                          autoClose: 5000,
                          onConfirm: () => completeReminder(reminder.id),
                        });
                      }}
                    >
                      Complete
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Weekly supervision meeting",
                  description: "Discuss complex cases",
                  time: "Tomorrow, 2:00 PM",
                  priority: "medium",
                },
                {
                  title: "Client progress review",
                  description: "David Wilson - family therapy",
                  time: "Friday, 10:00 AM",
                  priority: "medium",
                },
                {
                  title: "License renewal deadline",
                  description: "Submit continuing education credits",
                  time: "Next week",
                  priority: "low",
                },
              ].map((reminder, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30"
                >
                  <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{reminder.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {reminder.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {reminder.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="therapease-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Reminder Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium">Client Follow-ups</h4>
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-xs text-muted-foreground">active</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium">Documentation</h4>
                <p className="text-2xl font-bold text-accent">3</p>
                <p className="text-xs text-muted-foreground">pending</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium">Administrative</h4>
                <p className="text-2xl font-bold text-secondary-foreground">
                  2
                </p>
                <p className="text-xs text-muted-foreground">scheduled</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium">Professional</h4>
                <p className="text-2xl font-bold text-muted-foreground">1</p>
                <p className="text-xs text-muted-foreground">upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddReminderModal
        open={addReminderModalOpen}
        onOpenChange={setAddReminderModalOpen}
      />
    </Layout>
  );
};

export default Reminders;
