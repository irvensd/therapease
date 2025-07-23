import React, { useState, useEffect, useCallback } from "react";
import Layout from "@/components/Layout";
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
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
  Briefcase,
  Save,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

// Types for better type safety
interface UserSettings {
  // Profile settings
  name: string;
  title: string;
  email: string;
  phone: string;
  license: string;
  bio: string;

  // Notification settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  paymentNotifications: boolean;

  // Practice settings
  sessionDuration: string;
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };

  // Security settings
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  passwordChangeRequired: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  const { showModal, ModalComponent } = useConfirmationModal();

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [settings, setSettings] = useState<UserSettings>({
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
    timezone: "EST",
    workingHours: {
      start: "09:00",
      end: "17:00",
    },

    // Security settings
    twoFactorEnabled: false,
    sessionTimeout: "30",
    passwordChangeRequired: false,
  });

  const [originalSettings, setOriginalSettings] =
    useState<UserSettings>(settings);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMobile, setIsMobile] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      try {
        const savedSettings = localStorage.getItem("therapease_settings");
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
          setOriginalSettings(parsedSettings);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Loading Error",
          description: "Could not load saved settings. Using defaults.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 800);
  }, [toast]);

  // Track changes
  useEffect(() => {
    const hasChanges =
      JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasUnsavedChanges(hasChanges);
  }, [settings, originalSettings]);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string): boolean => {
    return (
      password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
    );
  };

  const updateSetting = useCallback(
    (key: string, value: any) => {
      setSettings((prev) => {
        if (key.includes(".")) {
          const [parentKey, childKey] = key.split(".");
          return {
            ...prev,
            [parentKey]: {
              ...(prev as any)[parentKey],
              [childKey]: value,
            },
          };
        }
        return { ...prev, [key]: value };
      });

      // Clear specific error when user starts typing
      if (errors[key]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const validateSettings = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!settings.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!settings.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(settings.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!settings.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(settings.phone)) {
      newErrors.phone = "Please enter phone in format: (123) 456-7890";
    }

    if (!settings.license.trim()) {
      newErrors.license = "License number is required";
    }

    // Validate password change if attempted
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }

      if (!newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (!validatePassword(newPassword)) {
        newErrors.newPassword =
          "Password must be at least 8 characters with uppercase, lowercase, and number";
      }

      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveSettings = useCallback(async () => {
    if (!validateSettings()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save to localStorage
      localStorage.setItem("therapease_settings", JSON.stringify(settings));

      // Handle password change if provided
      if (newPassword && currentPassword) {
        // In real app, would make API call to change password
        localStorage.setItem("password_last_changed", new Date().toISOString());
        setNewPassword("");
        setConfirmPassword("");
        setCurrentPassword("");

        toast({
          title: "Password Changed",
          description: "Your password has been updated successfully.",
        });
      }

      setOriginalSettings(settings);
      setHasUnsavedChanges(false);

      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Save Failed",
        description:
          "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [settings, newPassword, currentPassword, toast]);

  const discardChanges = useCallback(() => {
    showModal({
      type: "destructive",
      title: "Discard Changes",
      message:
        "Are you sure you want to discard all unsaved changes? This action cannot be undone.",
      confirmLabel: "Discard Changes",
      cancelLabel: "Keep Editing",
      showCancel: true,
      onConfirm: () => {
        setSettings(originalSettings);
        setNewPassword("");
        setConfirmPassword("");
        setCurrentPassword("");
        setErrors({});
        toast({
          title: "Changes Discarded",
          description: "All unsaved changes have been discarded.",
        });
      },
    });
  }, [showModal, originalSettings, toast]);

  const resetToDefaults = useCallback(() => {
    showModal({
      type: "destructive",
      title: "Reset to Defaults",
      message:
        "Are you sure you want to reset all settings to their default values? This will overwrite all your current preferences.",
      confirmLabel: "Reset to Defaults",
      cancelLabel: "Cancel",
      showCancel: true,
      onConfirm: () => {
        const defaultSettings: UserSettings = {
          name: "Dr. Sarah Wilson",
          title: "Licensed Clinical Psychologist",
          email: "sarah.wilson@therapease.com",
          phone: "(555) 123-4567",
          license: "PSY-12345",
          bio: "Experienced therapist specializing in anxiety, depression, and trauma therapy.",
          emailNotifications: true,
          smsNotifications: false,
          appointmentReminders: true,
          paymentNotifications: true,
          sessionDuration: "60",
          timezone: "EST",
          workingHours: { start: "09:00", end: "17:00" },
          twoFactorEnabled: false,
          sessionTimeout: "30",
          passwordChangeRequired: false,
        };

        setSettings(defaultSettings);
        setErrors({});
        toast({
          title: "Settings Reset",
          description: "All settings have been reset to default values.",
        });
      },
    });
  }, [showModal, toast]);

  const enableTwoFactor = useCallback(() => {
    showModal({
      type: "info",
      title: "Enable Two-Factor Authentication",
      message:
        "Two-factor authentication adds an extra layer of security to your account. You'll need an authenticator app like Google Authenticator or Authy. Do you want to continue?",
      confirmLabel: "Enable 2FA",
      cancelLabel: "Cancel",
      showCancel: true,
      onConfirm: () => {
        updateSetting("twoFactorEnabled", true);
        toast({
          title: "2FA Enabled",
          description:
            "Two-factor authentication has been enabled for your account.",
        });
      },
    });
  }, [showModal, updateSetting, toast]);

  const disableTwoFactor = useCallback(() => {
    showModal({
      type: "destructive",
      title: "Disable Two-Factor Authentication",
      message:
        "Disabling two-factor authentication will make your account less secure. Are you sure you want to continue?",
      confirmLabel: "Disable 2FA",
      cancelLabel: "Keep Enabled",
      showCancel: true,
      onConfirm: () => {
        updateSetting("twoFactorEnabled", false);
        toast({
          title: "2FA Disabled",
          description: "Two-factor authentication has been disabled.",
          variant: "destructive",
        });
      },
    });
  }, [showModal, updateSetting, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading settings...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              Settings
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your account and application preferences
            </p>
            {hasUnsavedChanges && (
              <Badge variant="outline" className="mt-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved changes
              </Badge>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {hasUnsavedChanges && (
              <Button variant="outline" onClick={discardChanges} className="w-full sm:w-auto">
                Discard Changes
              </Button>
            )}
            <Button
              onClick={saveSettings}
              disabled={isSaving || !hasUnsavedChanges}
              className="w-full sm:w-auto"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Profile</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Practice</span>
              <span className="sm:hidden">Practice</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) => updateSetting("name", e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-sm text-red-500 mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={settings.title}
                      onChange={(e) => updateSetting("title", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSetting("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                    />
                    {errors.email && (
                      <p id="email-error" className="text-sm text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => updateSetting("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                      className={errors.phone ? "border-red-500" : ""}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                    />
                    {errors.phone && (
                      <p id="phone-error" className="text-sm text-red-500 mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="license">License Number *</Label>
                  <Input
                    id="license"
                    value={settings.license}
                    onChange={(e) => updateSetting("license", e.target.value)}
                    className={errors.license ? "border-red-500" : ""}
                    aria-describedby={
                      errors.license ? "license-error" : undefined
                    }
                  />
                  {errors.license && (
                    <p id="license-error" className="text-sm text-red-500 mt-1">
                      {errors.license}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => updateSetting("bio", e.target.value)}
                    rows={4}
                    placeholder="Brief description of your professional background and specialties..."
                  />
                </div>

                <div className="pt-4">
                  <Button variant="outline" onClick={resetToDefaults}>
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("emailNotifications", checked)
                    }
                    aria-label="Toggle email notifications"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive urgent alerts via text message
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("smsNotifications", checked)
                    }
                    aria-label="Toggle SMS notifications"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="space-y-0.5">
                    <Label>Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminders to clients before appointments
                    </p>
                  </div>
                  <Switch
                    checked={settings.appointmentReminders}
                    onCheckedChange={(checked) =>
                      updateSetting("appointmentReminders", checked)
                    }
                    aria-label="Toggle appointment reminders"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="space-y-0.5">
                    <Label>Payment Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about payment receipts and issues
                    </p>
                  </div>
                  <Switch
                    checked={settings.paymentNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("paymentNotifications", checked)
                    }
                    aria-label="Toggle payment notifications"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practice">
            <Card>
              <CardHeader>
                <CardTitle>Practice Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Default Session Duration</Label>
                    <Select
                      value={settings.sessionDuration}
                      onValueChange={(value) =>
                        updateSetting("sessionDuration", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Timezone</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) =>
                        updateSetting("timezone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                        <SelectItem value="CST">Central Time (CST)</SelectItem>
                        <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                        <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Working Hours</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="start-time" className="text-sm">
                        Start Time
                      </Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={settings.workingHours.start}
                        onChange={(e) =>
                          updateSetting("workingHours.start", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-time" className="text-sm">
                        End Time
                      </Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={settings.workingHours.end}
                        onChange={(e) =>
                          updateSetting("workingHours.end", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {settings.twoFactorEnabled && (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Enabled
                        </Badge>
                      )}
                      <Switch
                        checked={settings.twoFactorEnabled}
                        onCheckedChange={(checked) =>
                          checked ? enableTwoFactor() : disableTwoFactor()
                        }
                        aria-label="Toggle two-factor authentication"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Session Timeout</Label>
                    <Select
                      value={settings.sessionTimeout}
                      onValueChange={(value) =>
                        updateSetting("sessionTimeout", value)
                      }
                    >
                      <SelectTrigger className="w-full sm:w-48 mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={
                          errors.currentPassword ? "border-red-500" : ""
                        }
                        aria-describedby={
                          errors.currentPassword
                            ? "current-password-error"
                            : undefined
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.currentPassword && (
                      <p
                        id="current-password-error"
                        className="text-sm text-red-500 mt-1"
                      >
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters with uppercase, lowercase, and number"
                      className={errors.newPassword ? "border-red-500" : ""}
                      aria-describedby={
                        errors.newPassword ? "new-password-error" : undefined
                      }
                    />
                    {errors.newPassword && (
                      <p
                        id="new-password-error"
                        className="text-sm text-red-500 mt-1"
                      >
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirm-password-error"
                          : undefined
                      }
                    />
                    {errors.confirmPassword && (
                      <p
                        id="confirm-password-error"
                        className="text-sm text-red-500 mt-1"
                      >
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <ModalComponent />
      </div>
    </Layout>
  );
};

export default Settings;
