import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bot,
  Brain,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  FileText,
  Users,
  Sparkles,
  MessageSquare,
  X,
  Send,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAssistantProps {
  mode?: "dashboard" | "client" | "session" | "notes" | "general";
  clientData?: any;
  isFloating?: boolean;
}

type AIInsight = {
  id: string;
  type: "insight" | "warning" | "recommendation" | "success";
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  icon: any;
  action?: string;
};

type AIMessage = {
  id: string;
  type: "ai" | "user";
  content: string;
  timestamp: Date;
};

export function AIAssistant({
  mode = "general",
  clientData,
  isFloating = false,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<"insights" | "chat" | "prep">(
    "insights",
  );
  const [chatMessages, setChatMessages] = useState<AIMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Mock AI insights based on mode
  const getInsights = (): AIInsight[] => {
    switch (mode) {
      case "dashboard":
        return [
          {
            id: "1",
            type: "insight",
            title: "Practice Optimization",
            content:
              "Your session completion rate (94%) is excellent. Consider adding 2 more weekly slots to meet demand.",
            priority: "medium",
            icon: TrendingUp,
            action: "View Schedule",
          },
          {
            id: "2",
            type: "warning",
            title: "Documentation Alert",
            content:
              "Emma Thompson's last session note is incomplete. Missing treatment goals section.",
            priority: "high",
            icon: AlertTriangle,
            action: "Complete Note",
          },
          {
            id: "3",
            type: "recommendation",
            title: "Treatment Suggestion",
            content:
              "Based on recent sessions, Michael Chen may benefit from CBT homework assignments.",
            priority: "medium",
            icon: Lightbulb,
            action: "Create Assignment",
          },
          {
            id: "4",
            type: "success",
            title: "Positive Trend",
            content:
              "3 clients have shown measurable improvement this month - great work!",
            priority: "low",
            icon: Sparkles,
          },
        ];
      case "client":
        return [
          {
            id: "5",
            type: "insight",
            title: "Session Pattern",
            content: `${clientData?.name || "This client"} shows best engagement during morning appointments (83% vs 67% afternoon).`,
            priority: "medium",
            icon: Brain,
          },
          {
            id: "6",
            type: "recommendation",
            title: "Assessment Due",
            content:
              "It's been 8 weeks since last PHQ-9 assessment. Consider readministering to track progress.",
            priority: "high",
            icon: FileText,
            action: "Schedule Assessment",
          },
        ];
      default:
        return [
          {
            id: "7",
            type: "insight",
            title: "AI Ready",
            content:
              "I'm here to help with clinical insights, session preparation, and documentation assistance.",
            priority: "low",
            icon: Bot,
          },
        ];
    }
  };

  const [insights] = useState<AIInsight[]>(getInsights());

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: "user",
      content: userInput,
      timestamp: new Date(),
    };

    const currentInput = userInput;
    setChatMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsTyping(true);

    // Simulate realistic typing delay based on response length
    const response = generateAIResponse(currentInput);
    const typingDelay = Math.min(Math.max(response.length * 30, 1000), 4000);

    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, typingDelay);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // Greeting responses
    if (
      lowerInput.includes("hello") ||
      lowerInput.includes("hi") ||
      lowerInput.includes("hey")
    ) {
      return "Hello! I'm your AI Clinical Assistant. I'm here to help with documentation, treatment planning, risk assessment, and practice management. What would you like to work on today?";
    }

    // Note documentation
    if (lowerInput.includes("note") || lowerInput.includes("documentation")) {
      return "I can help you with professional session notes! I support multiple formats:\n\n• **SOAP Notes** - Most comprehensive (Subjective, Objective, Assessment, Plan)\n• **DAP Notes** - Concise format (Data, Assessment, Plan)\n• **BIRP Notes** - Behavior-focused (Behavior, Intervention, Response, Plan)\n\nI can also auto-generate notes based on your session details. Which format would you prefer, or would you like me to generate a note for a specific client?";
    }

    // Treatment planning
    if (
      lowerInput.includes("treatment") ||
      lowerInput.includes("intervention") ||
      lowerInput.includes("therapy")
    ) {
      return "I can provide evidence-based treatment recommendations! Here are some proven approaches:\n\n**For Anxiety Disorders:**\n• CBT with exposure therapy (Cohen's d = 1.2)\n• Mindfulness-based interventions\n• Progressive muscle relaxation\n\n**For Depression:**\n• CBT + Behavioral Activation (highly effective)\n• Interpersonal Therapy (IPT)\n• Mindfulness-Based Cognitive Therapy\n\nWhat specific presenting concerns are you addressing? I can provide targeted recommendations.";
    }

    // Risk assessment
    if (
      lowerInput.includes("risk") ||
      lowerInput.includes("safety") ||
      lowerInput.includes("crisis") ||
      lowerInput.includes("suicide")
    ) {
      return "⚠️ **Safety Assessment Protocol:**\n\n**Immediate Risk Factors:**\n• Expressed hopelessness or worthlessness\n• Social withdrawal and isolation\n• Sleep disturbances (insomnia/hypersomnia)\n• Substance use changes\n• Giving away possessions\n\n**Assessment Tools:**\n• Columbia Suicide Severity Rating Scale\n• Beck Scale for Suicide Ideation\n• SAD PERSONS Scale\n\n**Crisis Resources:** 988 Suicide & Crisis Lifeline\n\nWould you like me to guide you through a formal risk assessment, or do you need immediate crisis consultation?";
    }

    // Assessment tools
    if (
      lowerInput.includes("assessment") ||
      lowerInput.includes("phq") ||
      lowerInput.includes("gad") ||
      lowerInput.includes("test")
    ) {
      return "I can help with clinical assessments! Available tools:\n\n• **PHQ-9** - Depression screening (0-27 scale)\n• **GAD-7** - Anxiety assessment (0-21 scale)\n• **PCL-5** - PTSD symptoms (0-80 scale)\n• **DASS-21** - Depression, Anxiety, Stress\n\nI can administer these assessments, score them automatically, and track progress over time. Which assessment would you like to use, or would you like to review recent results?";
    }

    // Scheduling and practice management
    if (
      lowerInput.includes("schedule") ||
      lowerInput.includes("appointment") ||
      lowerInput.includes("time")
    ) {
      return "**Scheduling Optimization Tips:**\n\n• **Peak Performance Times:** Most clients engage better 9-11 AM\n• **Session Frequency:** Weekly for acute cases, bi-weekly for maintenance\n• **Buffer Time:** 15 minutes between sessions for notes\n• **No-Show Prevention:** Automated reminders 24hrs + 2hrs before\n\nYour current 94% completion rate is excellent! Would you like me to analyze your schedule for optimization opportunities?";
    }

    // Specific client questions
    if (lowerInput.includes("emma") || lowerInput.includes("client")) {
      return "I can provide client-specific insights! For Emma Thompson:\n\n• **Progress:** 67% improvement in PHQ-9 scores\n• **Optimal Times:** Best engagement in morning slots\n• **Next Steps:** Consider PHQ-9 reassessment\n• **Treatment:** CBT with exposure therapy showing excellent results\n\nWould you like detailed progress charts, session prep, or treatment recommendations for Emma or another client?";
    }

    // General helpful response
    const responses = [
      "I'm here to support your clinical practice! I can help with:\n\n• **Documentation** - Generate SOAP, DAP, BIRP notes\n• **Treatment Planning** - Evidence-based recommendations\n• **Risk Assessment** - Safety protocols and crisis resources\n• **Progress Tracking** - Visual charts and outcome measures\n��� **Practice Management** - Scheduling and workflow optimization\n\nWhat specific area would you like assistance with?",

      "As your AI Clinical Assistant, I can provide:\n\n• **Real-time clinical insights** based on current research\n• **Automated documentation** that saves you time\n• **Risk monitoring** and safety alerts\n• **Treatment outcome predictions** using evidence-based data\n• **Practice analytics** to optimize your workflow\n\nHow can I help you provide exceptional care today?",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning":
        return AlertTriangle;
      case "recommendation":
        return Lightbulb;
      case "success":
        return Sparkles;
      default:
        return Brain;
    }
  };

  if (isFloating) {
    return (
      <>
        {/* Floating AI Assistant Button */}
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          size="lg"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>

        {/* Custom AI Assistant Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-[600px] max-h-[700px] mx-4 overflow-hidden">
              <div className="p-6 pb-0 border-b">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold">TherapEase AI Assistant</h2>
                  <Badge variant="secondary" className="ml-auto">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 ml-2"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

            <div className="px-6">
              {/* Tabs */}
              <div className="flex gap-1 mb-4">
                <Button
                  variant={activeTab === "insights" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("insights")}
                >
                  <Brain className="h-4 w-4 mr-1" />
                  Insights
                </Button>
                <Button
                  variant={activeTab === "chat" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("chat")}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button
                  variant={activeTab === "prep" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("prep")}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Session Prep
                </Button>
              </div>

              {/* Content */}
              <div className="h-[400px]">
                {activeTab === "insights" && (
                  <ScrollArea className="h-full">
                    <div className="space-y-3 pr-4">
                      {insights.map((insight) => {
                        const IconComponent = insight.icon;
                        return (
                          <Card
                            key={insight.id}
                            className="border-l-4 border-l-primary"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div
                                  className={cn(
                                    "p-2 rounded-lg border",
                                    getPriorityColor(insight.priority),
                                  )}
                                >
                                  <IconComponent className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-sm">
                                      {insight.title}
                                    </h4>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {insight.priority}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {insight.content}
                                  </p>
                                  {insight.action && (
                                    <Button size="sm" variant="outline">
                                      {insight.action}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}

                {activeTab === "chat" && (
                  <div className="flex flex-col h-full">
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-3">
                        {chatMessages.length === 0 && (
                          <div className="text-center py-8">
                            <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                              Ask me anything about clinical practice,
                              documentation, or treatment planning!
                            </p>
                          </div>
                        )}
                        {chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex",
                              message.type === "user"
                                ? "justify-end"
                                : "justify-start",
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[80%] rounded-lg p-3 text-sm",
                                message.type === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted",
                              )}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-muted rounded-lg p-3 text-sm">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                <div
                                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                />
                                <div
                                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2 mt-4">
                      <Textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask about treatment plans, documentation, risk assessment..."
                        className="resize-none"
                        rows={2}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <Button
                        onClick={sendMessage}
                        size="sm"
                        className="self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "prep" && (
                  <ScrollArea className="h-full">
                    <div className="space-y-4 pr-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">
                            Next Session: Emma Thompson
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <h5 className="font-medium text-xs text-muted-foreground">
                              Last Session Summary
                            </h5>
                            <p className="text-sm">
                              Discussed anxiety management techniques. Client
                              reported 6/10 anxiety levels, down from 8/10.
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-xs text-muted-foreground">
                              AI Recommendations
                            </h5>
                            <ul className="text-sm space-y-1">
                              <li>• Review CBT homework completion</li>
                              <li>• Practice breathing exercises together</li>
                              <li>• Assess sleep pattern improvements</li>
                              <li>• Consider PHQ-9 reassessment</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-xs text-muted-foreground">
                              Risk Factors
                            </h5>
                            <Badge variant="outline" className="text-xs">
                              No current concerns
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">
                            Treatment Goals Progress
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Reduce anxiety symptoms</span>
                              <span className="text-green-600">75%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: "75%" }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Embedded version for dashboard/pages
  return (
    <Card className="therapease-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
            <Bot className="h-3 w-3 text-white" />
          </div>
          AI Clinical Assistant
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            {insights.length} insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.slice(0, 3).map((insight) => {
          const IconComponent = insight.icon;
          return (
            <div
              key={insight.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
            >
              <div
                className={cn(
                  "p-1.5 rounded border",
                  getPriorityColor(insight.priority),
                )}
              >
                <IconComponent className="h-3 w-3" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-xs">{insight.title}</h5>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {insight.content}
                </p>
                {insight.action && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs mt-2"
                  >
                    {insight.action}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          Open AI Assistant
        </Button>
      </CardContent>
    </Card>
  );
}