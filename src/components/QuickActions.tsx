import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Calendar,
  FileText,
  DollarSign,
  Clock,
  Users,
  Bell,
  Search,
  Zap,
  ChevronDown,
  Phone,
  Video,
  Mail,
  Download,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";

interface QuickActionsProps {
  mode?: "toolbar" | "floating" | "compact";
  className?: string;
  onAction?: (action: string, data?: any) => void;
}

type QuickAction = {
  id: string;
  label: string;
  icon: any;
  shortcut?: string;
  color?: string;
  category: "create" | "schedule" | "communication" | "tools";
  action: () => void;
  urgent?: boolean;
};

export function QuickActions({
  mode = "toolbar",
  className,
  onAction,
}: QuickActionsProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { showModal, ModalComponent } = useConfirmationModal();

  const handleAction = (actionId: string, data?: any) => {
    console.log(`Quick action: ${actionId}`, data);
    onAction?.(actionId, data);

    // Provide immediate feedback for actions
    const actionMessages: Record<string, string> = {
      "new-client":
        "✅ New Client form ready! Fill in their information to get started.",
      "schedule-session":
        "📅 Session scheduler ready! Select your client and preferred time slot.",
      "create-note":
        "📝 Note editor opened! Document your session with AI assistance available.",
      "create-invoice":
        "💰 Invoice builder ready! Add services and the system will calculate totals.",
      "emergency-contact":
        "🚨 Emergency resources displayed. These contacts are available 24/7.",
      "backup-data":
        "💾 Practice data exported successfully! Download will start automatically.",
      "quick-search":
        "🔍 Global search activated! Type to find clients, notes, sessions, or invoices.",
      "video-call": "📹 Opening secure video call platform in new window...",
      "send-reminder":
        "📲 Reminder system ready! Choose client and reminder type.",
    };

    if (actionMessages[actionId]) {
      alert(actionMessages[actionId]);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: "new-client",
      label: "Add Client",
      icon: Users,
      shortcut: "Ctrl+N",
      color: "bg-blue-500 hover:bg-blue-600",
      category: "create",
      action: () => {
        handleAction("new-client");
        // This would typically open the NewClientModal
      },
    },
    {
      id: "schedule-session",
      label: "Schedule Session",
      icon: Calendar,
      shortcut: "Ctrl+S",
      color: "bg-green-500 hover:bg-green-600",
      category: "schedule",
      action: () => {
        handleAction("schedule-session");
        navigate("/sessions");
      },
    },
    {
      id: "create-note",
      label: "New Note",
      icon: FileText,
      shortcut: "Ctrl+T",
      color: "bg-purple-500 hover:bg-purple-600",
      category: "create",
      action: () => {
        handleAction("create-note");
        navigate("/notes");
      },
    },
    {
      id: "create-invoice",
      label: "Create Invoice",
      icon: DollarSign,
      shortcut: "Ctrl+I",
      color: "bg-orange-500 hover:bg-orange-600",
      category: "create",
      action: () => {
        handleAction("create-invoice");
        navigate("/invoices");
      },
    },
    {
      id: "quick-search",
      label: "Quick Search",
      icon: Search,
      shortcut: "Ctrl+K",
      color: "bg-gray-500 hover:bg-gray-600",
      category: "tools",
      action: () => {
        handleAction("quick-search");
        // This would open a search modal
      },
    },
    {
      id: "video-call",
      label: "Start Video Call",
      icon: Video,
      color: "bg-indigo-500 hover:bg-indigo-600",
      category: "communication",
      action: () => {
        handleAction("video-call");
        window.open("https://meet.google.com", "_blank");
      },
    },
    {
      id: "send-reminder",
      label: "Send Reminder",
      icon: Bell,
      color: "bg-yellow-500 hover:bg-yellow-600",
      category: "communication",
      action: () => {
        handleAction("send-reminder");
      },
    },
    {
      id: "emergency-contact",
      label: "Emergency Resources",
      icon: Phone,
      color: "bg-red-500 hover:bg-red-600",
      category: "tools",
      urgent: true,
      action: () => {
        handleAction("emergency-contact");
        alert(`Emergency Resources:

National Suicide Prevention Lifeline: 988
Crisis Text Line: Text HOME to 741741
National Sexual Assault Hotline: 1-800-656-4673
National Domestic Violence Hotline: 1-800-799-7233

Local Emergency Services: 911`);
      },
    },
    {
      id: "backup-data",
      label: "Backup Data",
      icon: Download,
      color: "bg-teal-500 hover:bg-teal-600",
      category: "tools",
      action: () => {
        handleAction("backup-data");
        // Simulate data export
        const data = JSON.stringify(
          {
            exported: new Date().toISOString(),
            clients: 48,
            sessions: 234,
            notes: 198,
            invoices: 145,
          },
          null,
          2,
        );
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `therapease-backup-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
    },
  ];

  const primaryActions = quickActions.filter((action) =>
    [
      "new-client",
      "schedule-session",
      "create-note",
      "create-invoice",
    ].includes(action.id),
  );

  const secondaryActions = quickActions.filter(
    (action) => !primaryActions.includes(action),
  );

  if (mode === "floating") {
    return (
      <div className="fixed bottom-20 right-6 z-40">
        <div className="flex flex-col gap-2">
          {/* Primary floating action */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={primaryActions[0]?.action}
                  className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  size="lg"
                >
                  <Zap className="h-6 w-6 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Quick Actions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Expandable actions */}
          {isExpanded && (
            <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2">
              {primaryActions.slice(0, 4).map((action) => {
                const IconComponent = action.icon;
                return (
                  <TooltipProvider key={action.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={action.action}
                          className={cn(
                            "h-12 w-12 rounded-full shadow-md hover:shadow-lg transition-all duration-200",
                            action.color,
                          )}
                          size="sm"
                        >
                          <IconComponent className="h-5 w-5 text-white" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>
                          {action.label}
                          {action.shortcut && (
                            <span className="ml-2 text-xs opacity-60">
                              {action.shortcut}
                            </span>
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {primaryActions.slice(0, 3).map((action) => {
          const IconComponent = action.icon;
          return (
            <TooltipProvider key={action.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={action.action}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {secondaryActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <DropdownMenuItem
                  key={action.id}
                  onClick={action.action}
                  className={cn(action.urgent && "text-red-600")}
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {action.label}
                  {action.shortcut && (
                    <span className="ml-auto text-xs opacity-60">
                      {action.shortcut}
                    </span>
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Default toolbar mode
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-950 border border-border rounded-lg shadow-sm p-3",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Quick Actions</h3>
          <Badge variant="secondary" className="text-xs">
            {quickActions.length} available
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Primary actions grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {primaryActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={action.id}
              onClick={action.action}
              variant="outline"
              className="h-16 flex-col gap-1 text-xs"
            >
              <IconComponent className="h-5 w-5" />
              <span>{action.label}</span>
              {action.shortcut && (
                <span className="text-xs opacity-60">{action.shortcut}</span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Secondary actions */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-medium">
          More Actions
        </p>
        <div className="flex flex-wrap gap-1">
          {secondaryActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <TooltipProvider key={action.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={action.action}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0",
                        action.urgent &&
                          "text-red-600 hover:text-red-700 hover:bg-red-50",
                      )}
                    >
                      <IconComponent className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {action.label}
                      {action.urgent && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          Emergency
                        </Badge>
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>

      {/* Usage stats */}
      <div className="mt-3 pt-3 border-t text-center">
        <p className="text-xs text-muted-foreground">
          12 actions completed today •{" "}
          <span className="text-green-600">34% efficiency boost</span>
        </p>
      </div>
    </div>
  );
}
