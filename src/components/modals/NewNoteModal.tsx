import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface NewNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewNoteModal({ open, onOpenChange }: NewNoteModalProps) {
  const [formData, setFormData] = useState({
    client: "",
    sessionDate: "",
    sessionType: "",
    duration: "",
    noteType: "",
    content: "",
    goals: "",
    followUp: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New note data:", formData);

    setFormData({
      client: "",
      sessionDate: "",
      sessionType: "",
      duration: "",
      noteType: "",
      content: "",
      goals: "",
      followUp: "",
    });
    onOpenChange(false);

    alert("Session note created successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Session Note</DialogTitle>
          <DialogDescription>
            Document your therapy session with HIPAA-compliant notes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
                  <SelectValue placeholder="Select client" />
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
              <Label htmlFor="sessionDate" className="text-right">
                Session Date
              </Label>
              <Input
                id="sessionDate"
                type="datetime-local"
                value={formData.sessionDate}
                onChange={(e) =>
                  setFormData({ ...formData, sessionDate: e.target.value })
                }
                className="col-span-3"
                required
              />
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
                  <SelectItem value="assessment">Assessment</SelectItem>
                </SelectContent>
              </Select>
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
              <Label htmlFor="noteType" className="text-right">
                Note Type
              </Label>
              <Select
                value={formData.noteType}
                onValueChange={(value) =>
                  setFormData({ ...formData, noteType: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select note template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soap">SOAP Note</SelectItem>
                  <SelectItem value="dap">DAP Note</SelectItem>
                  <SelectItem value="birp">BIRP Note</SelectItem>
                  <SelectItem value="progress">Progress Note</SelectItem>
                  <SelectItem value="assessment">Assessment Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right mt-2">
                Session Notes
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="col-span-3"
                placeholder="Document the session content, client progress, interventions used, and observations..."
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="goals" className="text-right mt-2">
                Goals & Objectives
              </Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
                className="col-span-3"
                placeholder="Treatment goals addressed in this session and progress made..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="followUp" className="text-right mt-2">
                Follow-up Actions
              </Label>
              <Textarea
                id="followUp"
                value={formData.followUp}
                onChange={(e) =>
                  setFormData({ ...formData, followUp: e.target.value })
                }
                className="col-span-3"
                placeholder="Homework assignments, referrals, next session focus..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
