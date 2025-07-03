import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface NewClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewClientModal({ open, onOpenChange }: NewClientModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    insurance: "",
    diagnosis: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {},
  );

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Client name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        break;
      case "phone":
        if (!value.trim()) return "Phone number is required";
        const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
        if (!phoneRegex.test(value)) return "Phone format: (555) 123-4567";
        break;
    }
    return "";
  };

  const handleFieldChange = (field: string, value: string) => {
    // Format phone number automatically
    if (field === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        const formatted = digitsOnly.replace(
          /(\d{3})(\d{3})(\d{4})/,
          "($1) $2-$3",
        );
        value = formatted;
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const error = validateField(
      field,
      formData[field as keyof typeof formData],
    );
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.name &&
          formData.email &&
          formData.phone &&
          !errors.name &&
          !errors.email &&
          !errors.phone
        );
      case 2:
        return formData.insurance;
      default:
        return true;
    }
  };

  const getFormProgress = () => {
    const totalFields = 6;
    const filledFields = Object.values(formData).filter((value) =>
      value.trim(),
    ).length;
    return (filledFields / totalFields) * 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((field) => {
      if (["name", "email", "phone"].includes(field)) {
        const error = validateField(
          field,
          formData[field as keyof typeof formData],
        );
        if (error) newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouchedFields({
        name: true,
        email: true,
        phone: true,
        insurance: true,
      });
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("New client data:", formData);

      // Reset form and close modal
      setFormData({
        name: "",
        email: "",
        phone: "",
        insurance: "",
        diagnosis: "",
        notes: "",
      });
      setCurrentStep(1);
      setErrors({});
      setTouchedFields({});

      toast({
        variant: "success",
        title: "Client Added Successfully! 🎉",
        description: `${formData.name} has been added to your client list and is ready for scheduling.`,
        duration: 5000,
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Adding Client",
        description: "There was a problem adding the client. Please try again.",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                Add New Client
                <Badge variant="outline">Step {currentStep} of 3</Badge>
              </DialogTitle>
              <DialogDescription>
                {currentStep === 1 && "Enter basic contact information"}
                {currentStep === 2 && "Insurance and billing details"}
                {currentStep === 3 && "Initial assessment and notes"}
              </DialogDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">
                Form Progress
              </div>
              <Progress value={getFormProgress()} className="w-24 h-2" />
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  onBlur={() => handleFieldBlur("name")}
                  placeholder="Enter client's full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && touchedFields.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => handleFieldBlur("email")}
                  placeholder="client@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && touchedFields.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  onBlur={() => handleFieldBlur("phone")}
                  placeholder="(555) 123-4567"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && touchedFields.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Insurance Information */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance Provider *</Label>
                <Select
                  value={formData.insurance}
                  onValueChange={(value) =>
                    handleFieldChange("insurance", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select insurance provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue-cross">
                      Blue Cross Blue Shield
                    </SelectItem>
                    <SelectItem value="aetna">Aetna</SelectItem>
                    <SelectItem value="united">United Healthcare</SelectItem>
                    <SelectItem value="cigna">Cigna</SelectItem>
                    <SelectItem value="medicare">Medicare</SelectItem>
                    <SelectItem value="medicaid">Medicaid</SelectItem>
                    <SelectItem value="self-pay">Self Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">
                  Insurance Verification
                </h4>
                <p className="text-sm text-blue-800">
                  We'll automatically verify benefits and coverage details once
                  the client is added. You'll receive a notification when
                  verification is complete.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Initial Assessment */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Presenting Concerns</Label>
                <Textarea
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) =>
                    handleFieldChange("diagnosis", e.target.value)
                  }
                  placeholder="Brief description of presenting concerns or referral reason..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Initial Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleFieldChange("notes", e.target.value)}
                  placeholder="Any additional notes about the client or initial assessment..."
                  rows={4}
                />
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Next Steps</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Schedule initial intake appointment</li>
                  <li>• Send intake forms and consent documents</li>
                  <li>• Verify insurance benefits</li>
                  <li>• Set up treatment plan</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>

            <div className="flex gap-2">
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!isStepValid(currentStep)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </div>
                  ) : (
                    "Add Client"
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
