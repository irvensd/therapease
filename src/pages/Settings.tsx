import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  CreditCard,
  Save,
  Upload,
} from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    // Profile settings
    name: "Dr. Sarah Wilson",
    title: "Licensed Clinical Psychologist",
    email: "sarah.wilson@therapease.com",
    phone: "(555) 123-4567",
    license: "PSY-12345",
    bio: "Experienced therapist specializing in anxiety, depression, and trauma therapy.",

    // Notification settings
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    paymentNotifications: true,

    // Practice settings
    sessionDuration: "60",
    timezone: "America/New_York",
    workingHours: {
      start: "09:00",
      end: "17:00",
    },

    // Security settings
    twoFactorEnabled: false,
    sessionTimeout: "30",
  });

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Update your personal and professional information
              </p>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configure how and when you receive notifications
              </p>
              <Button variant="outline" className="w-full">
                Manage Notifications
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage your password and privacy settings
              </p>
              <Button variant="outline" className="w-full">
                Security Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View your subscription and billing information
              </p>
              <Button variant="outline" className="w-full">
                Billing Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
