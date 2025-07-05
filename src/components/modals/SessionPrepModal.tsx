import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  FileText,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Brain,
  Heart,
  Lightbulb,
  Save,
  X,
} from "lucide-react";

interface SessionPrepModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: {
    name: string;
    type: string;
    sessionNumber: number;
    treatmentFocus: string;
    time: string;
    duration: string;
  } | null;
}

export function SessionPrepModal({
  open,
  onOpenChange,
  client,
}: SessionPrepModalProps) {
  // Default client data if none provided
  const defaultClient = {
    name: "Sarah Johnson",
    type: "Individual Therapy",
    sessionNumber: 8,
    treatmentFocus: "Depression & Self-Esteem",
    time: "1:00 PM",
    duration: "60 min",
  };

  const sessionClient = client || defaultClient;
  const [sessionPlan, setSessionPlan] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [prepChecklist, setPrepChecklist] = useState({
    reviewedNotes: false,
    plannedAgenda: false,
    preparedMaterials: false,
    checkedHomework: false,
    reviewedGoals: false,
  });

  const handleChecklistChange = (item: keyof typeof prepChecklist) => {
    setPrepChecklist(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleSaveAndClose = () => {
    console.log("Saving session prep:", { sessionPlan, keyPoints, prepChecklist });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Session Preparation</DialogTitle>
              <p className="text-muted-foreground">
                {sessionClient.name} • {sessionClient.type} • Session #{sessionClient.sessionNumber}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">
                {sessionClient.time} • {sessionClient.duration}
              </div>
              <p className="text-sm text-muted-foreground">
                Starting in 2 hours
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Left Column - Client Overview & Checklist */}
          <div className="space-y-6">
            {/* Client Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-lg">{sessionClient.name}</p>
                  <p className="text-sm text-muted-foreground">{sessionClient.type}</p>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Treatment Focus</span>
                  </div>
                  <p className="text-sm">{sessionClient.treatmentFocus}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Session #{sessionClient.sessionNumber}</span>
                  </div>
                  <Badge variant="outline">Individual Therapy</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Recent Flags</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Client mentioned increased anxiety about work deadlines in last session
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Preparation Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Prep Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: 'reviewedNotes', label: 'Reviewed previous session notes', icon: FileText },
                  { key: 'plannedAgenda', label: 'Planned session agenda', icon: Calendar },
                  { key: 'preparedMaterials', label: 'Prepared materials/worksheets', icon: Brain },
                  { key: 'checkedHomework', label: 'Checked homework/assignments', icon: Target },
                  { key: 'reviewedGoals', label: 'Reviewed treatment goals', icon: Heart },
                ].map((item) => (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.key}
                      checked={prepChecklist[item.key as keyof typeof prepChecklist]}
                      onCheckedChange={() => handleChecklistChange(item.key as keyof typeof prepChecklist)}
                    />
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <label
                        htmlFor={item.key}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.label}
                      </label>
                    </div>
                  </div>
                ))}
                <Separator className="my-3" />
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Object.values(prepChecklist).filter(Boolean).length}/5
                  </div>
                  <p className="text-xs text-muted-foreground">Tasks completed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Columns - Content Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="history" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="history">Session History</TabsTrigger>
                <TabsTrigger value="plan">Session Plan</TabsTrigger>
                <TabsTrigger value="goals">Treatment Goals</TabsTrigger>
                <TabsTrigger value="notes">Key Points</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="flex-1 space-y-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Recent Session History</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Review what happened in previous sessions
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/30 border-l-4 border-blue-500">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">Session #7 - Last Week</p>
                          <Badge variant="outline">Nov 15, 2024</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Focus:</strong> Work-related stress and anxiety management
                        </p>
                        <p className="text-sm mb-2">
                          Client expressed increased anxiety about upcoming project deadlines. We worked on breathing techniques and cognitive reframing exercises.
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <strong>Homework assigned:</strong> Daily mood tracking, practice breathing exercises
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/30 border-l-4 border-green-500">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">Session #6</p>
                          <Badge variant="outline">Nov 8, 2024</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Focus:</strong> Self-esteem and negative thought patterns
                        </p>
                        <p className="text-sm mb-2">
                          Introduced CBT techniques for challenging negative self-talk. Good progress on thought record exercises.
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <strong>Homework completed:</strong> Thought record worksheet - 5/7 days
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="plan" className="flex-1 space-y-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Today's Session Plan
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Plan your agenda and approach for this session
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="What do you want to accomplish in this session?

Examples:
• Check in on mood tracking homework
• Continue work on cognitive reframing
• Address any new stressors
• Practice anxiety management techniques
• Review progress on treatment goals"
                      value={sessionPlan}
                      onChange={(e) => setSessionPlan(e.target.value)}
                      className="min-h-[400px] resize-none"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="goals" className="flex-1 space-y-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Treatment Goals Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-green-900">Goal 1: Reduce anxiety symptoms</p>
                          <Badge className="bg-green-100 text-green-800">On Track</Badge>
                        </div>
                        <p className="text-sm text-green-800 mb-2">
                          Client reports 40% reduction in daily anxiety levels using breathing techniques
                        </p>
                        <div className="w-full bg-white rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                        </div>
                        <p className="text-xs text-green-700 mt-1">70% progress</p>
                      </div>

                      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-yellow-900">Goal 2: Improve self-esteem</p>
                          <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                        </div>
                        <p className="text-sm text-yellow-800 mb-2">
                          Some progress on challenging negative thoughts, needs more practice
                        </p>
                        <div className="w-full bg-white rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                        <p className="text-xs text-yellow-700 mt-1">45% progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="flex-1 space-y-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Key Points to Remember</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Important things to discuss or follow up on
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Key points for this session:

• Follow up on homework completion
• Check on work situation stress levels
• Discuss any family dynamics changes
• Review coping strategies effectiveness
• Address any new concerns or events"
                      value={keyPoints}
                      onChange={(e) => setKeyPoints(e.target.value)}
                      className="min-h-[400px] resize-none"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Session starts in 2 hours</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
            <Button onClick={handleSaveAndClose}>
              <Save className="mr-2 h-4 w-4" />
              Save Preparation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 