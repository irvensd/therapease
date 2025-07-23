// WARNING: Using div-based modal to avoid shadcn Dialog freezing issues
// DO NOT replace with shadcn Dialog component

import { useState, useEffect } from "react";
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

interface EditingNote {
  id: number;
  clientName: string;
  title: string;
  content: string;
  goals: string;
  followUp: string;
  type: "SOAP" | "DAP" | "BIRP" | "Progress";
  diagnosis: string;
}

interface NewNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNote?: EditingNote | null;
}

export function NewNoteModal({
  open,
  onOpenChange,
  editingNote,
}: NewNoteModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clientName: "",
    title: "",
    type: "",
    content: "",
    goals: "",
    followUp: "",
    diagnosis: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (editingNote) {
      setFormData({
        clientName: editingNote.clientName,
        title: editingNote.title,
        type: editingNote.type,
        content: editingNote.content,
        goals: editingNote.goals,
        followUp: editingNote.followUp,
        diagnosis: editingNote.diagnosis,
      });
    } else {
      setFormData({
        clientName: "",
        title: "",
        type: "",
        content: "",
        goals: "",
        followUp: "",
        diagnosis: "",
      });
    }
  }, [editingNote, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.clientName || !formData.title || !formData.type || !formData.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    console.log("Note data:", formData);

    toast({
      title: editingNote ? "Note Updated" : "Note Created",
      description: `Clinical note has been ${editingNote ? "updated" : "created"} successfully.`,
    });

    // Reset form and close modal
    setFormData({
      clientName: "",
      title: "",
      type: "",
      content: "",
      goals: "",
      followUp: "",
      diagnosis: "",
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
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">
              {editingNote ? "Edit Clinical Note" : "New Clinical Note"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {editingNote ? "Update the clinical note details" : "Create a new clinical note for documentation"}
            </p>
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
            {/* Row 1: Client and Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Select
                  value={formData.clientName}
                  onValueChange={(value) =>
                    setFormData({ ...formData, clientName: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Emma Thompson">Emma Thompson</SelectItem>
                    <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="David Wilson">David Wilson</SelectItem>
                    <SelectItem value="Lisa Park">Lisa Park</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Note Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Session 5 - Progress Review"
                  required
                />
              </div>
            </div>

            {/* Row 2: Type and Diagnosis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Note Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select note type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOAP">SOAP Note</SelectItem>
                    <SelectItem value="DAP">DAP Note</SelectItem>
                    <SelectItem value="BIRP">BIRP Note</SelectItem>
                    <SelectItem value="Progress">Progress Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosis: e.target.value })
                  }
                  placeholder="e.g., Generalized Anxiety Disorder"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Note Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Enter session notes, observations, interventions..."
                rows={8}
                className="min-h-[200px]"
                required
              />
            </div>

            {/* Goals */}
            <div className="space-y-2">
              <Label htmlFor="goals">Treatment Goals</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
                placeholder="List treatment goals and objectives..."
                rows={3}
              />
            </div>

            {/* Follow Up */}
            <div className="space-y-2">
              <Label htmlFor="followUp">Follow-up Actions</Label>
              <Textarea
                id="followUp"
                value={formData.followUp}
                onChange={(e) =>
                  setFormData({ ...formData, followUp: e.target.value })
                }
                placeholder="Next steps, homework assignments, follow-up tasks..."
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
            <Button type="submit">
              {editingNote ? "Update Note" : "Create Note"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
