import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  Calendar as CalendarIcon,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Download,
  Eye,
  Settings,
  Bell,
  CreditCard,
  FileText,
  Phone,
  Video,
  Users,
  Shield,
  Star,
} from "lucide-react";

// Mock portal data for demonstration
const mockPortalData = {
  clientInfo: {
    name: "Emma Thompson",
    email: "emma.thompson@email.com",
    phone: "(555) 123-4567",
    nextSession: "2024-11-29 10:30 AM",
    therapist: "Dr. Sarah Wilson",
    status: "Active"
  },
  upcomingAppointments: [
    {
      id: 1,
      date: "2024-11-29",
      time: "10:30 AM",
      type: "Individual Therapy",
      location: "In-Person",
      status: "Confirmed"
    },
    {
      id: 2,
      date: "2024-12-06",
      time: "10:30 AM", 
      type: "Individual Therapy",
      location: "In-Person",
      status: "Confirmed"
    }
  ],
  messages: [
    {
      id: 1,
      from: "Dr. Sarah Wilson",
      subject: "Session Reminder",
      preview: "Just a friendly reminder about your upcoming session tomorrow...",
      date: "2024-11-28",
      isRead: false
    },
    {
      id: 2,
      from: "Dr. Sarah Wilson", 
      subject: "Homework Assignment",
      preview: "Here's the breathing exercise we discussed in our last session...",
      date: "2024-11-22",
      isRead: true
    }
  ],
  availableSlots: [
    { date: "2024-12-13", time: "9:00 AM" },
    { date: "2024-12-13", time: "10:30 AM" },
    { date: "2024-12-13", time: "2:00 PM" },
    { date: "2024-12-16", time: "10:30 AM" },
    { date: "2024-12-16", time: "11:30 AM" },
    { date: "2024-12-20", time: "9:00 AM" },
    { date: "2024-12-20", time: "2:00 PM" }
  ],
  forms: [
    {
      id: 1,
      title: "Weekly Check-in Form",
      description: "Brief assessment of your mood and progress this week",
      status: "Pending",
      dueDate: "2024-11-30"
    },
    {
      id: 2,
      title: "Session Feedback",
      description: "Feedback about your last therapy session",
      status: "Completed",
      completedDate: "2024-11-22"
    }
  ]
};

const ClientPortal = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newMessage, setNewMessage] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "Completed": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Client Portal</h1>
            <p className="text-muted-foreground">
              Self-service scheduling, messaging, and account management for clients
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Portal Settings
            </Button>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Portal Invite
            </Button>
          </div>
        </div>

        {/* Portal Preview */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Client Portal Preview
              </CardTitle>
              <Badge className="bg-blue-100 text-blue-800">Live Preview</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              This is how the portal appears to your clients
            </p>
          </CardHeader>
          <CardContent>
            {/* Portal Interface */}
            <div className="bg-muted/30 rounded-lg p-6">
              {/* Portal Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div>
                  <h2 className="text-xl font-semibold">Welcome, {mockPortalData.clientInfo.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Therapist: {mockPortalData.clientInfo.therapist} • Status: {mockPortalData.clientInfo.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Next Session</p>
                  <p className="text-lg font-semibold text-primary">{mockPortalData.clientInfo.nextSession}</p>
                </div>
              </div>

              {/* Portal Tabs */}
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                  <TabsTrigger value="forms">Forms</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>

                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <CalendarIcon className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Next Session</p>
                            <p className="font-semibold">Tomorrow 10:30 AM</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">New Messages</p>
                            <p className="font-semibold">1 unread</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-orange-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Pending Forms</p>
                            <p className="font-semibold">1 to complete</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <Button className="h-auto flex-col gap-2 p-4">
                          <CalendarIcon className="h-6 w-6" />
                          <span>Schedule Appointment</span>
                        </Button>
                        <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                          <MessageSquare className="h-6 w-6" />
                          <span>Send Message</span>
                        </Button>
                        <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                          <FileText className="h-6 w-6" />
                          <span>Complete Forms</span>
                        </Button>
                        <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                          <CreditCard className="h-6 w-6" />
                          <span>View Billing</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Appointments */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockPortalData.upcomingAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <CalendarIcon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{appointment.type}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(appointment.date).toLocaleDateString()} at {appointment.time} • {appointment.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                              {appointment.location === "Telehealth" && (
                                <Button size="sm">
                                  <Video className="mr-1 h-3 w-3" />
                                  Join Call
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Schedule Tab */}
                <TabsContent value="schedule" className="space-y-4">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Available Appointments</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Select a date and time to schedule your next session
                        </p>
                      </CardHeader>
                      <CardContent>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="rounded-md border"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Available Time Slots</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mockPortalData.availableSlots.map((slot, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                              <div>
                                <p className="font-medium">{new Date(slot.date).toLocaleDateString()}</p>
                                <p className="text-sm text-muted-foreground">{slot.time}</p>
                              </div>
                              <Button size="sm" variant="outline">
                                Select
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full mt-4">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          Request Different Time
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Messages Tab */}
                <TabsContent value="messages" className="space-y-4">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Messages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mockPortalData.messages.map((message) => (
                            <div key={message.id} className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${!message.isRead ? 'bg-blue-50 border-blue-200' : ''}`}>
                              <div className="flex justify-between items-start mb-2">
                                <p className="font-medium">{message.subject}</p>
                                <div className="flex items-center gap-2">
                                  {!message.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                                  <span className="text-xs text-muted-foreground">{message.date}</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">From: {message.from}</p>
                              <p className="text-sm">{message.preview}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Send Message</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Input placeholder="Subject" />
                        <Textarea 
                          placeholder="Type your message here..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[200px]"
                        />
                        <Button className="w-full">
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Forms Tab */}
                <TabsContent value="forms" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Forms & Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockPortalData.forms.map((form) => (
                          <div key={form.id} className="flex items-center justify-between p-4 rounded-lg border">
                            <div className="flex-1">
                              <h4 className="font-semibold">{form.title}</h4>
                              <p className="text-sm text-muted-foreground">{form.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge className={getStatusColor(form.status)}>
                                  {form.status}
                                </Badge>
                                {form.status === "Pending" && (
                                  <span className="text-sm text-muted-foreground">
                                    Due: {new Date(form.dueDate!).toLocaleDateString()}
                                  </span>
                                )}
                                {form.status === "Completed" && (
                                  <span className="text-sm text-muted-foreground">
                                    Completed: {new Date(form.completedDate!).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {form.status === "Pending" && (
                                <Button>Complete Form</Button>
                              )}
                              {form.status === "Completed" && (
                                <Button variant="outline">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <Input value={mockPortalData.clientInfo.name} readOnly />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input value={mockPortalData.clientInfo.email} readOnly />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Phone</label>
                          <Input value={mockPortalData.clientInfo.phone} readOnly />
                        </div>
                        <Button variant="outline" className="w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          Update Profile
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Session Reminders</label>
                          <Select defaultValue="24hours">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="24hours">24 hours before</SelectItem>
                              <SelectItem value="2hours">2 hours before</SelectItem>
                              <SelectItem value="30min">30 minutes before</SelectItem>
                              <SelectItem value="none">No reminders</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Preferred Contact Method</label>
                          <Select defaultValue="email">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                                                 <Button className="w-full">
                           <CheckCircle className="mr-2 h-4 w-4" />
                           Save Preferences
                         </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Portal Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Portal Usage Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">85%</p>
                <p className="text-sm text-muted-foreground">Client Adoption Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">142</p>
                <p className="text-sm text-muted-foreground">Self-Scheduled Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">96%</p>
                <p className="text-sm text-muted-foreground">Form Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">4.8</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ClientPortal;
