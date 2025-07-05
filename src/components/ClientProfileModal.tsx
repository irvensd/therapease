import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Shield,
  Users,
  Heart,
  Activity,
  TrendingUp,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Edit,
  Download,
  Eye,
  UserPlus,
  History,
  Target,
  Brain,
  Stethoscope,
  Globe,
  MessageSquare,
} from "lucide-react";

interface ClientProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: any;
}

export function ClientProfileModal({ open, onOpenChange, client }: ClientProfileModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!client) return null;

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-200";
      case "Inactive": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
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

  const getAssessmentColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "minimal": return "text-green-600";
      case "mild": return "text-yellow-600";
      case "moderate": return "text-orange-600";
      case "severe": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[95vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold">
                  {client.firstName[0]}{client.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">
                  {client.firstName} {client.lastName}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {client.preferredName && client.preferredName !== client.firstName && `"${client.preferredName}" • `}
                    Age {calculateAge(client.dateOfBirth)} • {client.pronouns}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="portal">Client Portal</TabsTrigger>
          </TabsList>

          <div className="mt-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{client.email}</p>
                        <p className="text-xs text-muted-foreground">Primary Email</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{client.phone}</p>
                        <p className="text-xs text-muted-foreground">Primary Phone</p>
                      </div>
                    </div>
                    {client.altPhone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{client.altPhone}</p>
                          <p className="text-xs text-muted-foreground">Alternative Phone</p>
                        </div>
                      </div>
                    )}
                    <Separator />
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{client.address.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.address.city}, {client.address.state} {client.address.zipCode}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Clinical Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" />
                      Clinical Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Presenting Concern</p>
                      <p className="text-sm">{client.presentingConcern}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Primary Diagnosis</p>
                      <p className="text-sm">{client.diagnosis.primary}</p>
                    </div>
                    {client.diagnosis.secondary && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Secondary Diagnosis</p>
                        <p className="text-sm">{client.diagnosis.secondary}</p>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Risk Level</span>
                      <Badge className={`${getRiskColor(client.riskLevel)}`} variant="outline">
                        {client.riskLevel}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Session Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Session Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Sessions</span>
                      <span className="text-2xl font-bold">{client.sessionsCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Frequency</span>
                      <span className="font-medium">{client.sessionFrequency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Last Session</span>
                      <span className="font-medium">
                        {client.lastSession ? new Date(client.lastSession).toLocaleDateString() : "Never"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Next Session</span>
                      <span className="font-medium">
                        {client.nextSession ? new Date(client.nextSession).toLocaleDateString() : "Not scheduled"}
                      </span>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Preferred Session Type</p>
                      <Badge variant="outline">{client.preferredSessionType}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Treatment Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Treatment Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {client.treatmentGoals.map((goal: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{goal}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Demographics Tab */}
            <TabsContent value="demographics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">First Name</p>
                        <p className="font-medium">{client.firstName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                        <p className="font-medium">{client.lastName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Preferred Name</p>
                      <p className="font-medium">{client.preferredName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">{new Date(client.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Age</p>
                        <p className="font-medium">{calculateAge(client.dateOfBirth)} years old</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Gender</p>
                        <p className="font-medium">{client.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pronouns</p>
                        <p className="font-medium">{client.pronouns}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Marital Status</p>
                      <p className="font-medium">{client.maritalStatus}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                      <p className="font-medium">{client.occupation}</p>
                    </div>
                    {client.employer && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Employer</p>
                        <p className="font-medium">{client.employer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Emergency Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {client.emergencyContacts.map((contact: any, index: number) => (
                      <div key={index} className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{contact.name}</h4>
                          {contact.isPrimary && (
                            <Badge variant="outline" className="text-xs">Primary</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{contact.relationship}</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            <span>{contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3" />
                            <span>{contact.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Insurance Tab */}
            <TabsContent value="insurance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Primary Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Insurance Provider</p>
                        <p className="text-lg font-semibold">{client.insurance.primary.provider}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Plan Name</p>
                        <p className="font-medium">{client.insurance.primary.planName}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Policy Number</p>
                          <p className="font-medium font-mono">{client.insurance.primary.policyNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Group Number</p>
                          <p className="font-medium font-mono">{client.insurance.primary.groupNumber}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Subscriber</p>
                        <p className="font-medium">{client.insurance.primary.subscriberName}</p>
                        <p className="text-sm text-muted-foreground">{client.insurance.primary.subscriberId}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Effective Date</p>
                          <p className="font-medium">{new Date(client.insurance.primary.effectiveDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Expiration Date</p>
                          <p className="font-medium">{new Date(client.insurance.primary.expirationDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Summary */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Copay</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">${client.insurance.primary.copay}</p>
                    <p className="text-xs text-muted-foreground">per session</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Deductible</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">${client.insurance.primary.deductible}</p>
                    <p className="text-xs text-muted-foreground">
                      ${client.insurance.primary.deductibleMet} met ({Math.round(client.insurance.primary.deductibleMet / client.insurance.primary.deductible * 100)}%)
                    </p>
                    <Progress 
                      value={client.insurance.primary.deductibleMet / client.insurance.primary.deductible * 100} 
                      className="mt-2 h-2" 
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Coinsurance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">{client.insurance.primary.coinsurance}%</p>
                    <p className="text-xs text-muted-foreground">after deductible</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Out-of-Pocket Max</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">${client.insurance.primary.outOfPocketMax}</p>
                    <p className="text-xs text-muted-foreground">
                      ${client.insurance.primary.outOfPocketMet} met ({Math.round(client.insurance.primary.outOfPocketMet / client.insurance.primary.outOfPocketMax * 100)}%)
                    </p>
                    <Progress 
                      value={client.insurance.primary.outOfPocketMet / client.insurance.primary.outOfPocketMax * 100} 
                      className="mt-2 h-2" 
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Family Tab */}
            <TabsContent value="family" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Family & Relationship Mapping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {client.familyMembers?.map((member: any, index: number) => (
                      <div key={index} className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{member.name}</h4>
                                <p className="text-sm text-muted-foreground">{member.relationship}</p>
                              </div>
                            </div>
                            <div className="ml-13 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Age:</span>
                                <span className="text-sm font-medium">{member.age} years old</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">In Treatment:</span>
                                <Badge variant={member.isInTreatment ? "default" : "outline"}>
                                  {member.isInTreatment ? "Yes" : "No"}
                                </Badge>
                              </div>
                              {member.notes && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Notes:</p>
                                  <p className="text-sm">{member.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Treatment Tab */}
            <TabsContent value="treatment" className="space-y-6">
              <Card>
                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Treatment History Timeline
                </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {client.progressNotes?.map((note: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-primary"></div>
                          {index < client.progressNotes.length - 1 && (
                            <div className="w-px h-16 bg-border"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">Session #{note.session}</h4>
                              <p className="text-sm text-muted-foreground">{new Date(note.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{note.mood}</Badge>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-blue-600" />
                                <span className="text-sm font-medium">{note.progressRating}/10</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium">Key Topics:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {note.keyTopics.map((topic: string, i: number) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Homework:</p>
                              <p className="text-sm text-muted-foreground">{note.homework}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assessments Tab */}
            <TabsContent value="assessments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Clinical Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {client.assessments?.map((assessment: any, index: number) => (
                      <div key={index} className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold">{assessment.name}</h4>
                          <Badge className={`${getAssessmentColor(assessment.severity)}`} variant="outline">
                            {assessment.severity}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Current Score:</span>
                            <span className="text-lg font-bold">{assessment.score}</span>
                          </div>
                          {assessment.baseline && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Baseline:</span>
                              <span className="text-sm font-medium">{assessment.baseline}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Date:</span>
                            <span className="text-sm">{new Date(assessment.date).toLocaleDateString()}</span>
                          </div>
                          {assessment.baseline && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Improvement</span>
                                <span>{Math.round((1 - assessment.score / assessment.baseline) * 100)}%</span>
                              </div>
                              <Progress 
                                value={(1 - assessment.score / assessment.baseline) * 100} 
                                className="h-2" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Client Portal Tab */}
            <TabsContent value="portal" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Portal Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Portal Enabled</span>
                      <Badge variant={client.portalAccess.isEnabled ? "default" : "secondary"}>
                        {client.portalAccess.isEnabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Last Login</span>
                      <span className="text-sm font-medium">
                        {client.portalAccess.lastLogin ? new Date(client.portalAccess.lastLogin).toLocaleDateString() : "Never"}
                      </span>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Unread Messages</span>
                        <Badge variant={client.portalAccess.hasUnreadMessages ? "destructive" : "outline"}>
                          {client.portalAccess.hasUnreadMessages ? "Yes" : "None"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Upcoming Appointments</span>
                        <span className="font-medium">{client.portalAccess.upcomingAppointments}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Pending Forms</span>
                        <span className="font-medium">{client.portalAccess.pendingForms}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Client Communication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Appointment
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Send Forms
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Generate Portal Invite
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 