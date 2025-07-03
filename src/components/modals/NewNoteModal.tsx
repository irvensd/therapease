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
import { Badge } from "@/components/ui/badge";
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
import { useConfirmationModal } from "@/components/modals/ConfirmationModal";

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
  const [aiAssistanceEnabled, setAiAssistanceEnabled] = useState(true);
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);

  const generateAINote = async () => {
    if (!formData.client || !formData.sessionType) {
      alert("Please select a client and session type first.");
      return;
    }

    setIsGeneratingNote(true);

    // Simulate AI note generation with realistic delay
    setTimeout(() => {
      const aiGeneratedContent = generateNoteContent(
        formData.client,
        formData.sessionType,
        formData.noteType,
      );

      setFormData((prev) => ({
        ...prev,
        content: aiGeneratedContent.content,
        goals: aiGeneratedContent.goals,
        followUp: aiGeneratedContent.followUp,
      }));

      setIsGeneratingNote(false);

      // Show success message
      alert(
        `✨ AI Assistant generated a professional ${formData.noteType?.toUpperCase() || "progress"} note for ${formData.client === "emma" ? "Emma Thompson" : "the selected client"}. Review and edit as needed before saving.`,
      );
    }, 2000);
  };

  const generateNoteContent = (
    client: string,
    sessionType: string,
    noteType: string,
  ) => {
    const clientName =
      client === "emma"
        ? "Emma Thompson"
        : client === "michael"
          ? "Michael Chen"
          : client === "sarah"
            ? "Sarah Johnson"
            : client === "david"
              ? "David Wilson"
              : "the client";

    if (noteType === "soap") {
      return {
        content: `SUBJECTIVE: ${clientName} reported feeling anxious about upcoming work presentations. Client states anxiety level at 6/10, down from 8/10 last week. Reports using breathing techniques learned in previous session with moderate success. Sleep has improved slightly - averaging 6 hours per night versus 4-5 hours previously.

OBJECTIVE: Client appeared alert and engaged throughout session. Maintained good eye contact. Speech was clear and goal-directed. No signs of psychomotor agitation observed today. Client demonstrated breathing technique correctly when prompted.

ASSESSMENT: Client is showing gradual improvement in anxiety management skills. Continued progress toward treatment goals of reducing anxiety symptoms and improving coping strategies. No immediate safety concerns noted.

PLAN: Continue weekly individual therapy sessions. Review and practice additional CBT techniques for anxiety management. Assign homework: daily breathing exercises and thought record completion. Schedule follow-up in one week.`,
        goals:
          "1. Reduce anxiety symptoms from 8/10 to 4/10 within 6 weeks\n2. Implement daily coping strategies\n3. Improve sleep quality to 7+ hours nightly",
        followUp:
          "• Practice breathing exercises 2x daily\n• Complete thought record worksheet\n• Schedule relaxation time before presentations\n• Continue anxiety tracking journal",
      };
    }

    if (noteType === "dap") {
      return {
        content: `DATA: ${clientName} attended 60-minute ${sessionType.toLowerCase()} session. Client reported anxiety level 6/10 (improved from 8/10). Discussed work-related stress and presentation anxiety. Client demonstrated learned breathing techniques.

ASSESSMENT: Client shows continued progress in anxiety management. Improvement noted in sleep patterns and use of coping skills. Engaged well in session and motivated for treatment.

PLAN: Continue weekly therapy. Practice CBT techniques, complete homework assignments, follow up on anxiety tracking.`,
        goals:
          "Reduce anxiety symptoms and improve work-related stress management",
        followUp:
          "Breathing exercises daily, thought record completion, anxiety tracking",
      };
    }

    // Default progress note
    return {
      content: `${clientName} attended ${formData.duration}-minute ${sessionType.toLowerCase()} session. Session focused on anxiety management and coping skill development. Client reported decreased anxiety levels and improved sleep. Discussed strategies for managing work-related stress. Client demonstrated good understanding of therapeutic concepts and appeared motivated for continued treatment.`,
      goals:
        "Continue progress toward anxiety reduction and improved coping skills",
      followUp:
        "Practice assigned coping strategies and complete homework exercises",
    };
  };

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
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Create Session Note</DialogTitle>
              <DialogDescription>
                Document your therapy session with HIPAA-compliant notes.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                AI Assistant Active
              </Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateAINote}
                disabled={
                  isGeneratingNote || !formData.client || !formData.sessionType
                }
                className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200"
              >
                {isGeneratingNote ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>✨ AI Generate Note</>
                )}
              </Button>
            </div>
          </div>
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
