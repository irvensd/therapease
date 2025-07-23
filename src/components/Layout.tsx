import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AIAssistant } from "@/components/AIAssistant";
import { TherapistWellness } from "@/components/TherapistWellness";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarDays,
  FileText,
  Bell,
  Receipt,
  BarChart3,
  Target,
  Folder,
  Menu,
  X,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Sessions", href: "/sessions", icon: Calendar },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Documents", href: "/documents", icon: Folder },
  { name: "Progress", href: "/progress", icon: Target },
  { name: "Reminders", href: "/reminders", icon: Bell, badge: 3 },
  { name: "Invoices", href: "/invoices", icon: Receipt },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if Ctrl (or Cmd on Mac) is pressed and no input is focused
      if (!event.ctrlKey && !event.metaKey) return;

      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "SELECT" ||
          activeElement.getAttribute("contenteditable") === "true");

      // Don't trigger shortcuts when typing in input fields
      if (isInputFocused) return;

      switch (event.key.toLowerCase()) {
        case "n":
          event.preventDefault();
          // Trigger new client action - we'll need to communicate with Dashboard
          toast({
            title: "Keyboard Shortcut",
            description: "Opening new client form...",
          });
          // Navigate to clients page for now, could open modal if we had global state
          navigate("/clients");
          break;

        case "s":
          event.preventDefault();
          toast({
            title: "Keyboard Shortcut",
            description: "Opening session scheduler...",
          });
          navigate("/sessions");
          break;

        case "t":
          event.preventDefault();
          toast({
            title: "Keyboard Shortcut",
            description: "Opening note editor...",
          });
          navigate("/notes");
          break;

        case "i":
          event.preventDefault();
          toast({
            title: "Keyboard Shortcut",
            description: "Opening invoice creator...",
          });
          navigate("/invoices");
          break;

        case "k":
          event.preventDefault();
          toast({
            title: "Quick Search",
            description:
              "Search feature would open here! Use the search bar in the navigation.",
          });
          // Focus search input if available
          const searchInput = document.querySelector(
            'input[placeholder*="search"], input[placeholder*="Search"]',
          ) as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
          break;

        default:
          break;
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 therapease-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <Heart className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">
                TherapEase
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "outline"}
                          className={cn(
                            "h-5 min-w-5 px-1.5 text-xs",
                            isActive
                              ? "bg-sidebar-primary-foreground/10 text-sidebar-primary-foreground border-sidebar-primary-foreground/20"
                              : "bg-accent text-accent-foreground border-accent/50",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom section */}
          <div className="border-t border-sidebar-border p-4">
            <div className="space-y-2">
              <Link
                to="/settings"
                className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </Button>
            </div>

            {/* User info */}
            <div className="mt-4 pt-4 border-t border-sidebar-border">
              <p className="text-xs text-sidebar-foreground/70">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-sidebar-foreground/50">
                {user?.title || "Therapist"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden lg:block" />

            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="hidden sm:inline">AI Assistant Active</span>
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">{children}</main>

        {/* Floating AI Assistant - available throughout the app */}
        <AIAssistant isFloating={true} />

        {/* Wellness Alerts */}
        <TherapistWellness mode="alert" />
      </div>
    </div>
  );
}
