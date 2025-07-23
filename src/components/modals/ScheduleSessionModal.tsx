// WARNING: Using div-based modal to avoid shadcn Dialog freezing issues
// DO NOT replace with shadcn Dialog component

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface ScheduleSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleSession?: (sessionData: any) => void;
}

export function ScheduleSessionModal({
  open,
  onOpenChange,
  onScheduleSession,
}: ScheduleSessionModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    client: "",
    sessionType: "",
    date: "",
    time: "",
    duration: "60",
    location: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New session data:", formData);

    // Show success toast instead of problematic alert
    toast({
      title: "Session Scheduled",
      description: "The therapy session has been scheduled successfully.",
    });

    // Reset form and close modal
    setFormData({
      client: "",
      sessionType: "",
      date: "",
      time: "",
      duration: "60",
      location: "",
      notes: "",
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Schedule New Session</h2>
            <p className="text-sm text-gray-600 mt-1">Schedule a therapy session with a client.</p>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Client
              </Label>
              <Select
                value={formData.client}
                onValueChange={(value) =>
                  setFormData({ ...formData, client: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emma">Emma Thompson</SelectItem>
                  <SelectItem value="michael">Michael Chen</SelectItem>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="david">David Wilson</SelectItem>
                  <SelectItem value="lisa">Lisa Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sessionType" className="text-right">
                Session Type
              </Label>
              <Select
                value={formData.sessionType}
                onValueChange={(value) =>
                  setFormData({ ...formData, sessionType: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual Therapy</SelectItem>
                  <SelectItem value="couples">Couples Therapy</SelectItem>
                  <SelectItem value="family">Family Therapy</SelectItem>
                  <SelectItem value="group">Group Therapy</SelectItem>
                  <SelectItem value="assessment">Initial Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Select
                value={formData.duration}
                onValueChange={(value) =>
                  setFormData({ ...formData, duration: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Session duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Select
                value={formData.location}
                onValueChange={(value) =>
                  setFormData({ ...formData, location: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="telehealth">Telehealth</SelectItem>
                  <SelectItem value="home-visit">Home Visit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="col-span-3"
                placeholder="Session notes or special instructions..."
                rows={3}
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit">Schedule Session</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
