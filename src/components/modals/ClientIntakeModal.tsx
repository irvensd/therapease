import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  User,
  Heart,
  Brain,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Save,
  Send,
  Eye,
  Edit,
} from "lucide-react";

interface ClientIntakeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientIntakeModal({ open, onOpenChange }: ClientIntakeModalProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [formProgress, setFormProgress] = useState(15);
  
  // Form state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    preferredName: "",
    dateOfBirth: "",
    gender: "",
    pronouns: "",
    maritalStatus: "",
    occupation: "",
    employer: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA"
    }
  });

  const [contactInfo, setContactInfo] = useState({
    phone: "",
    altPhone: "",
    email: "",
    preferredContact: ""
  });

  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      name: "",
      relationship: "",
      phone: "",
      email: "",
      isPrimary: true
    }
  ]);

  const [insuranceInfo, setInsuranceInfo] = useState({
    provider: "",
    planName: "",
    policyNumber: "",
    groupNumber: "",
    subscriberName: "",
    subscriberId: "",
    copay: "",
    effectiveDate: "",
    expirationDate: ""
  });

  const [clinicalInfo, setClinicalInfo] = useState({
    presentingConcern: "",
    currentSymptoms: [],
    previousTherapy: "",
    medications: "",
    medicalHistory: "",
    substanceUse: "",
    familyHistory: "",
    goals: ""
  });

  const [assessmentScores, setAssessmentScores] = useState({
    phq9: Array(9).fill(0),
    gad7: Array(7).fill(0),
    pcl5: Array(20).fill(0)
  });

  // Assessment questions
  const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself or that you are a failure",
    "Trouble concentrating on things",
    "Moving or speaking slowly, or being fidgety/restless",
    "Thoughts that you would be better off dead or hurting yourself"
  ];

  const gad7Questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid, as if something awful might happen"
  ];

  const symptomsOptions = [
    "Anxiety", "Depression", "Sleep Issues", "Panic Attacks", "Social Anxiety",
    "PTSD Symptoms", "Relationship Issues", "Work Stress", "Family Conflicts",
    "Grief/Loss", "Anger Management", "Self-Esteem Issues", "Substance Use",
    "Eating Issues", "Chronic Pain", "Other"
  ];

  const calculateProgress = () => {
    let completed = 0;
    let total = 8;

    if (personalInfo.firstName && personalInfo.lastName && personalInfo.dateOfBirth) completed++;
    if (contactInfo.phone && contactInfo.email) completed++;
    if (emergencyContacts[0].name && emergencyContacts[0].phone) completed++;
    if (insuranceInfo.provider && insuranceInfo.policyNumber) completed++;
    if (clinicalInfo.presentingConcern) completed++;
    if (clinicalInfo.currentSymptoms.length > 0) completed++;
    if (assessmentScores.phq9.some(score => score > 0)) completed++;
    if (assessmentScores.gad7.some(score => score > 0)) completed++;

    return Math.round((completed / total) * 100);
  };

  const getScoreInterpretation = (scores: number[], type: string) => {
    const total = scores.reduce((sum, score) => sum + score, 0);
    
    if (type === "PHQ-9") {
      if (total <= 4) return { severity: "Minimal", color: "text-green-600" };
      if (total <= 9) return { severity: "Mild", color: "text-yellow-600" };
      if (total <= 14) return { severity: "Moderate", color: "text-orange-600" };
      if (total <= 19) return { severity: "Moderately Severe", color: "text-red-600" };
      return { severity: "Severe", color: "text-red-700" };
    }
    
    if (type === "GAD-7") {
      if (total <= 4) return { severity: "Minimal", color: "text-green-600" };
      if (total <= 9) return { severity: "Mild", color: "text-yellow-600" };
      if (total <= 14) return { severity: "Moderate", color: "text-orange-600" };
      return { severity: "Severe", color: "text-red-600" };
    }
    
    return { severity: "Unknown", color: "text-gray-600" };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[95vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">New Client Intake</DialogTitle>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Progress</p>
                <div className="flex items-center gap-2">
                  <Progress value={calculateProgress()} className="w-24 h-2" />
                  <span className="text-sm font-medium">{calculateProgress()}%</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="clinical">Clinical</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
          </TabsList>

          <div className="mt-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                        placeholder="Enter last name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferredName">Preferred Name</Label>
                      <Input
                        id="preferredName"
                        value={personalInfo.preferredName}
                        onChange={(e) => setPersonalInfo({...personalInfo, preferredName: e.target.value})}
                        placeholder="How you'd like to be addressed"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={personalInfo.gender} onValueChange={(value) => setPersonalInfo({...personalInfo, gender: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pronouns">Pronouns</Label>
                      <Select value={personalInfo.pronouns} onValueChange={(value) => setPersonalInfo({...personalInfo, pronouns: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pronouns" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="he/him">He/Him</SelectItem>
                          <SelectItem value="she/her">She/Her</SelectItem>
                          <SelectItem value="they/them">They/Them</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select value={personalInfo.maritalStatus} onValueChange={(value) => setPersonalInfo({...personalInfo, maritalStatus: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                          <SelectItem value="separated">Separated</SelectItem>
                          <SelectItem value="domestic-partnership">Domestic Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={personalInfo.occupation}
                        onChange={(e) => setPersonalInfo({...personalInfo, occupation: e.target.value})}
                        placeholder="Your job title"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="employer">Employer</Label>
                    <Input
                      id="employer"
                      value={personalInfo.employer}
                      onChange={(e) => setPersonalInfo({...personalInfo, employer: e.target.value})}
                      placeholder="Company or organization name"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Address</h4>
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={personalInfo.address.street}
                        onChange={(e) => setPersonalInfo({
                          ...personalInfo, 
                          address: {...personalInfo.address, street: e.target.value}
                        })}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={personalInfo.address.city}
                          onChange={(e) => setPersonalInfo({
                            ...personalInfo, 
                            address: {...personalInfo.address, city: e.target.value}
                          })}
                          placeholder="San Francisco"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={personalInfo.address.state}
                          onChange={(e) => setPersonalInfo({
                            ...personalInfo, 
                            address: {...personalInfo.address, state: e.target.value}
                          })}
                          placeholder="CA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={personalInfo.address.zipCode}
                          onChange={(e) => setPersonalInfo({
                            ...personalInfo, 
                            address: {...personalInfo.address, zipCode: e.target.value}
                          })}
                          placeholder="94102"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Information Tab */}
            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="phone">Primary Phone *</Label>
                      <Input
                        id="phone"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="altPhone">Alternative Phone</Label>
                      <Input
                        id="altPhone"
                        value={contactInfo.altPhone}
                        onChange={(e) => setContactInfo({...contactInfo, altPhone: e.target.value})}
                        placeholder="(555) 123-4568"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <Label>Preferred Contact Method</Label>
                    <RadioGroup 
                      value={contactInfo.preferredContact} 
                      onValueChange={(value) => setContactInfo({...contactInfo, preferredContact: value})}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="contact-phone" />
                        <Label htmlFor="contact-phone">Phone</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="contact-email" />
                        <Label htmlFor="contact-email">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="text" id="contact-text" />
                        <Label htmlFor="contact-text">Text Message</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Clinical Information Tab */}
            <TabsContent value="clinical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Clinical History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="presentingConcern">What brings you to therapy today? *</Label>
                    <Textarea
                      id="presentingConcern"
                      value={clinicalInfo.presentingConcern}
                      onChange={(e) => setClinicalInfo({...clinicalInfo, presentingConcern: e.target.value})}
                      placeholder="Please describe what you'd like to work on in therapy..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label>Current Symptoms (check all that apply)</Label>
                    <div className="grid gap-2 md:grid-cols-3 mt-2">
                      {symptomsOptions.map((symptom) => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox
                            id={symptom}
                            checked={clinicalInfo.currentSymptoms.includes(symptom)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setClinicalInfo({
                                  ...clinicalInfo,
                                  currentSymptoms: [...clinicalInfo.currentSymptoms, symptom]
                                });
                              } else {
                                setClinicalInfo({
                                  ...clinicalInfo,
                                  currentSymptoms: clinicalInfo.currentSymptoms.filter(s => s !== symptom)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="previousTherapy">Previous Therapy Experience</Label>
                    <Textarea
                      id="previousTherapy"
                      value={clinicalInfo.previousTherapy}
                      onChange={(e) => setClinicalInfo({...clinicalInfo, previousTherapy: e.target.value})}
                      placeholder="Have you been in therapy before? What was helpful or not helpful?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      value={clinicalInfo.medications}
                      onChange={(e) => setClinicalInfo({...clinicalInfo, medications: e.target.value})}
                      placeholder="List any medications you're currently taking, including dosages"
                    />
                  </div>

                  <div>
                    <Label htmlFor="goals">Therapy Goals</Label>
                    <Textarea
                      id="goals"
                      value={clinicalInfo.goals}
                      onChange={(e) => setClinicalInfo({...clinicalInfo, goals: e.target.value})}
                      placeholder="What would you like to achieve through therapy?"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assessment Tab */}
            <TabsContent value="assessment" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* PHQ-9 Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle>PHQ-9 Depression Screening</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Over the last 2 weeks, how often have you been bothered by any of the following problems?
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {phq9Questions.map((question, index) => (
                      <div key={index} className="space-y-2">
                        <Label className="text-sm">{index + 1}. {question}</Label>
                        <RadioGroup
                          value={assessmentScores.phq9[index].toString()}
                          onValueChange={(value) => {
                            const newScores = [...assessmentScores.phq9];
                            newScores[index] = parseInt(value);
                            setAssessmentScores({...assessmentScores, phq9: newScores});
                          }}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="0" id={`phq9-${index}-0`} />
                            <Label htmlFor={`phq9-${index}-0`} className="text-xs">Not at all</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="1" id={`phq9-${index}-1`} />
                            <Label htmlFor={`phq9-${index}-1`} className="text-xs">Several days</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="2" id={`phq9-${index}-2`} />
                            <Label htmlFor={`phq9-${index}-2`} className="text-xs">More than half</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="3" id={`phq9-${index}-3`} />
                            <Label htmlFor={`phq9-${index}-3`} className="text-xs">Nearly every day</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    ))}
                    
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">PHQ-9 Score:</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold">
                          {assessmentScores.phq9.reduce((sum, score) => sum + score, 0)}
                        </span>
                        <div className={`text-sm ${getScoreInterpretation(assessmentScores.phq9, "PHQ-9").color}`}>
                          {getScoreInterpretation(assessmentScores.phq9, "PHQ-9").severity}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* GAD-7 Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle>GAD-7 Anxiety Screening</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Over the last 2 weeks, how often have you been bothered by the following problems?
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {gad7Questions.map((question, index) => (
                      <div key={index} className="space-y-2">
                        <Label className="text-sm">{index + 1}. {question}</Label>
                        <RadioGroup
                          value={assessmentScores.gad7[index].toString()}
                          onValueChange={(value) => {
                            const newScores = [...assessmentScores.gad7];
                            newScores[index] = parseInt(value);
                            setAssessmentScores({...assessmentScores, gad7: newScores});
                          }}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="0" id={`gad7-${index}-0`} />
                            <Label htmlFor={`gad7-${index}-0`} className="text-xs">Not at all</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="1" id={`gad7-${index}-1`} />
                            <Label htmlFor={`gad7-${index}-1`} className="text-xs">Several days</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="2" id={`gad7-${index}-2`} />
                            <Label htmlFor={`gad7-${index}-2`} className="text-xs">More than half</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="3" id={`gad7-${index}-3`} />
                            <Label htmlFor={`gad7-${index}-3`} className="text-xs">Nearly every day</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    ))}
                    
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">GAD-7 Score:</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold">
                          {assessmentScores.gad7.reduce((sum, score) => sum + score, 0)}
                        </span>
                        <div className={`text-sm ${getScoreInterpretation(assessmentScores.gad7, "GAD-7").color}`}>
                          {getScoreInterpretation(assessmentScores.gad7, "GAD-7").severity}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Submit Intake
              </Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
