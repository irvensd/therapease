import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Heart,
  Brain,
  Coffee,
  Moon,
  Activity,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  Zap,
  Smile,
  Battery,
  Shield,
  TreePine,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TherapistWellnessProps {
  mode?: "dashboard" | "detailed" | "alert";
}

type WellnessMetric = {
  id: string;
  name: string;
  value: number; // 0-100
  status: "good" | "warning" | "critical";
  icon: any;
  color: string;
  recommendation?: string;
};

type WellnessAlert = {
  id: string;
  type: "break" | "boundary" | "burnout" | "celebration";
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  action?: string;
};

export function TherapistWellness({
  mode = "dashboard",
}: TherapistWellnessProps) {
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [wellnessJournal, setWellnessJournal] = useState("");
  const { showModal, ModalComponent } = useConfirmationModal();

  // Mock wellness data based on real burnout indicators
  const wellnessMetrics: WellnessMetric[] = [
    {
      id: "energy",
      name: "Energy Level",
      value: 72,
      status: "good",
      icon: Battery,
      color: "rgb(34, 197, 94)",
      recommendation: "Great energy! Consider maintaining current routine.",
    },
    {
      id: "workload",
      name: "Workload Balance",
      value: 58,
      status: "warning",
      icon: Activity,
      color: "rgb(245, 158, 11)",
      recommendation: "Approaching capacity. Consider spacing out sessions.",
    },
    {
      id: "boundaries",
      name: "Professional Boundaries",
      value: 85,
      status: "good",
      icon: Shield,
      color: "rgb(59, 130, 246)",
      recommendation: "Excellent boundary maintenance!",
    },
    {
      id: "sleep",
      name: "Sleep Quality",
      value: 45,
      status: "critical",
      icon: Moon,
      color: "rgb(239, 68, 68)",
      recommendation: "Sleep quality is low. Consider sleep hygiene review.",
    },
    {
      id: "selfcare",
      name: "Self-Care Activities",
      value: 68,
      status: "good",
      icon: Heart,
      color: "rgb(168, 85, 247)",
      recommendation: "Good self-care routine. Keep it up!",
    },
    {
      id: "emotional",
      name: "Emotional Regulation",
      value: 78,
      status: "good",
      icon: Brain,
      color: "rgb(6, 182, 212)",
      recommendation: "Strong emotional regulation skills.",
    },
  ];

  const wellnessAlerts: WellnessAlert[] = [
    {
      id: "1",
      type: "break",
      title: "Break Reminder",
      message:
        "You've been working for 3 hours straight. Time for a 15-minute break!",
      priority: "medium",
      action: "Take Break",
    },
    {
      id: "2",
      type: "boundary",
      title: "After-Hours Contact",
      message:
        "Client Emma sent a text after 8 PM. Consider setting communication boundaries.",
      priority: "low",
      action: "Review Boundaries",
    },
    {
      id: "3",
      type: "celebration",
      title: "Weekly Achievement",
      message:
        "Great week! You maintained good work-life balance and completed all documentation on time.",
      priority: "low",
    },
  ];

  const getOverallWellness = () => {
    const average =
      wellnessMetrics.reduce((sum, metric) => sum + metric.value, 0) /
      wellnessMetrics.length;
    return Math.round(average);
  };

  const getWellnessStatus = (score: number) => {
    if (score >= 75)
      return {
        status: "excellent",
        color: "text-green-600",
        bg: "bg-green-50",
      };
    if (score >= 60)
      return { status: "good", color: "text-blue-600", bg: "bg-blue-50" };
    if (score >= 40)
      return {
        status: "needs attention",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      };
    return { status: "critical", color: "text-red-600", bg: "bg-red-50" };
  };

  const overallScore = getOverallWellness();
  const wellnessStatus = getWellnessStatus(overallScore);

  const getDailyTips = () => [
    "Take 3 deep breaths between sessions",
    "Stay hydrated - aim for 8 glasses of water",
    "Step outside for 5 minutes during lunch",
    "Practice gratitude - write down 3 good things",
    "Stretch your shoulders and neck",
  ];

  if (mode === "alert") {
    const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

    const activeAlerts = wellnessAlerts.filter(
      (alert) => !dismissedAlerts.includes(alert.id),
    );

    const dismissAlert = (alertId: string) => {
      setDismissedAlerts((prev) => [...prev, alertId]);
    };

    const handleAction = (wellnessAlert: WellnessAlert) => {
      if (wellnessAlert.action === "Take Break") {
        showModal({
          type: "wellness",
          title: "Break Time Started! 🌿",
          message:
            "Great! Taking breaks is essential for your wellbeing. Your 15-minute break timer has started. Step away from your screen, stretch, breathe deeply, or take a short walk. The app will remind you when it's time to return.",
          confirmLabel: "Thanks, I'm taking my break!",
          autoClose: 8000,
          onConfirm: () => dismissAlert(wellnessAlert.id),
        });
      } else if (wellnessAlert.action === "Review Boundaries") {
        showModal({
          type: "info",
          title: "Professional Boundary Guidance 🛡️",
          message:
            "Consider setting up an auto-response for after-hours messages: 'Thank you for your message. I will respond during business hours (9 AM - 6 PM). For emergencies, please contact 911 or the crisis hotline at 988.' This protects both your wellbeing and sets clear expectations.",
          confirmLabel: "I'll set this up",
          cancelLabel: "Maybe later",
          showCancel: true,
          onConfirm: () => dismissAlert(wellnessAlert.id),
          onCancel: () => dismissAlert(wellnessAlert.id),
        });
      } else {
        dismissAlert(wellnessAlert.id);
      }
    };

    if (activeAlerts.length === 0) {
      return null;
    }

    return (
      <div className="fixed top-20 right-6 z-40 w-80">
        {activeAlerts.slice(0, 1).map((alert) => (
          <Card
            key={alert.id}
            className={cn(
              "border-l-4 shadow-lg animate-in slide-in-from-right-2",
              alert.type === "break"
                ? "border-l-blue-500"
                : alert.type === "boundary"
                  ? "border-l-yellow-500"
                  : alert.type === "burnout"
                    ? "border-l-red-500"
                    : "border-l-green-500",
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    alert.type === "break"
                      ? "bg-blue-100"
                      : alert.type === "boundary"
                        ? "bg-yellow-100"
                        : alert.type === "burnout"
                          ? "bg-red-100"
                          : "bg-green-100",
                  )}
                >
                  {alert.type === "break" ? (
                    <Coffee
                      className={cn(
                        "h-4 w-4",
                        alert.type === "break"
                          ? "text-blue-600"
                          : alert.type === "boundary"
                            ? "text-yellow-600"
                            : alert.type === "burnout"
                              ? "text-red-600"
                              : "text-green-600",
                      )}
                    />
                  ) : alert.type === "celebration" ? (
                    <Smile className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock
                      className={cn(
                        "h-4 w-4",
                        alert.type === "boundary"
                          ? "text-yellow-600"
                          : "text-red-600",
                      )}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.message}
                  </p>
                  <div className="flex gap-2 mt-3">
                    {alert.action && (
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleAction(alert)}
                      >
                        {alert.action}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => dismissAlert(alert.id)}
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (mode === "dashboard") {
    return (
      <Card className="therapease-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            Wellness Monitor
            <Badge
              variant="outline"
              className={cn("ml-auto", wellnessStatus.color, wellnessStatus.bg)}
            >
              {overallScore}% {wellnessStatus.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick wellness overview */}
          <div className="grid grid-cols-3 gap-3">
            {wellnessMetrics.slice(0, 3).map((metric) => {
              const IconComponent = metric.icon;
              return (
                <div key={metric.id} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${metric.color}20` }}
                    >
                      <IconComponent
                        className="h-4 w-4"
                        style={{ color: metric.color }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium">{metric.value}%</div>
                  <div className="text-xs text-muted-foreground">
                    {metric.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily tip */}
          <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <TreePine className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Today's Wellness Tip
              </span>
            </div>
            <p className="text-sm text-green-800">
              {getDailyTips()[new Date().getDay()]}
            </p>
          </div>

          <Dialog open={showDetailedView} onOpenChange={setShowDetailedView}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Activity className="h-4 w-4 mr-2" />
                View Detailed Wellness
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Therapist Wellness Dashboard
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Overall wellness score */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <div
                        className={cn(
                          "text-4xl font-bold mb-2",
                          wellnessStatus.color,
                        )}
                      >
                        {overallScore}%
                      </div>
                      <p className="text-muted-foreground">
                        Overall Wellness Score
                      </p>
                      <Badge
                        className={cn(
                          "mt-2",
                          wellnessStatus.bg,
                          wellnessStatus.color,
                        )}
                      >
                        {wellnessStatus.status}
                      </Badge>
                    </div>
                    <Progress value={overallScore} className="w-full" />
                  </CardContent>
                </Card>

                {/* Individual metrics */}
                <div className="grid gap-3">
                  {wellnessMetrics.map((metric) => {
                    const IconComponent = metric.icon;
                    return (
                      <Card key={metric.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${metric.color}20` }}
                            >
                              <IconComponent
                                className="h-4 w-4"
                                style={{ color: metric.color }}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-sm">
                                  {metric.name}
                                </h4>
                                <span className="text-sm font-bold">
                                  {metric.value}%
                                </span>
                              </div>
                              <Progress
                                value={metric.value}
                                className="h-2 mb-2"
                              />
                              {metric.recommendation && (
                                <p className="text-xs text-muted-foreground">
                                  {metric.recommendation}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Active alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Active Wellness Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {wellnessAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border",
                          alert.type === "break"
                            ? "bg-blue-50 border-blue-200"
                            : alert.type === "boundary"
                              ? "bg-yellow-50 border-yellow-200"
                              : alert.type === "burnout"
                                ? "bg-red-50 border-red-200"
                                : "bg-green-50 border-green-200",
                        )}
                      >
                        <div
                          className={cn(
                            "p-1.5 rounded-full",
                            alert.type === "break"
                              ? "bg-blue-100 text-blue-600"
                              : alert.type === "boundary"
                                ? "bg-yellow-100 text-yellow-600"
                                : alert.type === "burnout"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-green-100 text-green-600",
                          )}
                        >
                          {alert.type === "celebration" ? (
                            <Smile className="h-3 w-3" />
                          ) : alert.type === "break" ? (
                            <Coffee className="h-3 w-3" />
                          ) : (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{alert.title}</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            {alert.message}
                          </p>
                          {alert.action && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2"
                            >
                              {alert.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Wellness journal */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Daily Wellness Check-in
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="How are you feeling today? Any stressors or wins to note?"
                      value={wellnessJournal}
                      onChange={(e) => setWellnessJournal(e.target.value)}
                      rows={3}
                      className="mb-3"
                    />
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Check-in
                    </Button>
                  </CardContent>
                </Card>

                {/* Wellness resources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Wellness Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Guided Meditation (5 min)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Desk Stretches
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Self-Compassion Exercise
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Self-Care Time
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return null;
}
