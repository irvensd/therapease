import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  Square,
  Clock,
  User,
  FileText,
  Save,
  Phone,
  Video,
  Target,
  AlertCircle,
} from "lucide-react";

interface SessionWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: {
    name: string;
    type: string;
    sessionNumber: number;
    treatmentFocus: string;
    duration: string;
    startTime: string;
  } | null;
}

export function SessionWorkspaceModal({
  open,
  onOpenChange,
  client,
}: SessionWorkspaceModalProps) {
  // Default client data if none provided
  const defaultClient = {
    name: "Emma Thompson",
    type: "Individual Therapy",
    sessionNumber: 12,
    treatmentFocus: "Anxiety Management",
    duration: "60 min",
    startTime: "10:30 AM",
  };

  const sessionClient = client || defaultClient;
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionGoals, setSessionGoals] = useState("");

  // Timer logic
  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeElapsed(0);
  };

  const handleSaveNotes = () => {
    // Here you would typically save to your backend
    console.log("Saving session notes:", { sessionNotes, sessionGoals, timeElapsed });
    // Show success message or close modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Session in Progress</DialogTitle>
              <p className="text-muted-foreground">
                {sessionClient.name} • {sessionClient.type} • Session #{sessionClient.sessionNumber}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold">
                {formatTime(timeElapsed)}
              </div>
              <p className="text-sm text-muted-foreground">
                Started at {sessionClient.startTime}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Left Column - Timer & Controls */}
          <div className="space-y-6">
            {/* Session Timer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Session Timer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold mb-2">
                    {formatTime(timeElapsed)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Target: {sessionClient.duration}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleStartPause}
                    className="flex-1"
                    variant={isRunning ? "secondary" : "default"}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button onClick={handleStop} variant="outline">
                    <Square className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Client Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{sessionClient.name}</p>
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
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Video className="mr-2 h-4 w-4" />
                  Video Call
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  Voice Only
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Crisis Protocol
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle & Right Columns - Session Workspace */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="notes" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="notes">Session Notes</TabsTrigger>
                <TabsTrigger value="goals">Goals & Observations</TabsTrigger>
                <TabsTrigger value="history">Client History</TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="flex-1 space-y-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Session Notes</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Document what happens during this session
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Start typing your session notes here..."
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      className="min-h-[400px] resize-none"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="goals" className="flex-1 space-y-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Session Goals & Observations</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Track progress and note observations
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="What are the goals for this session? What observations are you making?"
                      value={sessionGoals}
                      onChange={(e) => setSessionGoals(e.target.value)}
                      className="min-h-[400px] resize-none"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="flex-1 space-y-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Recent Session History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">Session #11</p>
                          <Badge variant="outline">Nov 15, 2024</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Discussed anxiety triggers related to work presentations. Client showed improvement in breathing techniques.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">Session #10</p>
                          <Badge variant="outline">Nov 8, 2024</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Introduced CBT techniques for managing negative thought patterns. Homework assigned.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">Session #9</p>
                          <Badge variant="outline">Nov 1, 2024</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Client reported significant progress with sleep hygiene. Discussed family dynamics.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Session duration: {formatTime(timeElapsed)}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Minimize
            </Button>
            <Button onClick={handleSaveNotes}>
              <Save className="mr-2 h-4 w-4" />
              Save & Continue
            </Button>
            <Button variant="secondary">
              <Square className="mr-2 h-4 w-4" />
              End Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 