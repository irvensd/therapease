import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Session {
  id: number;
  clientName: string;
  clientId: string;
  date: string;
  time: string;
  duration: number;
  type: "Individual Therapy" | "Couples Therapy" | "Family Therapy" | "Group Therapy";
  format: "In-Person" | "Telehealth" | "Phone Call";
  status: "confirmed" | "pending" | "completed" | "cancelled" | "no-show";
  sessionNumber: number;
  treatmentFocus: string;
  location?: string;
  notes?: string;
  diagnosis?: string;
  isRecurring: boolean;
}

interface SessionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session | null;
  onEdit?: (session: Session) => void;
  onDelete?: (session: Session) => void;
}

export function SessionDetailsModal({
  open,
  onOpenChange,
  session,
  onEdit,
  onDelete,
}: SessionDetailsModalProps) {
  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Session Details - {session.clientName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <div>
            <h3 className="font-semibold">Basic Information</h3>
            <p>Client: {session.clientName}</p>
            <p>Date: {session.date}</p>
            <p>Time: {session.time}</p>
            <p>Duration: {session.duration} minutes</p>
            <p>Type: {session.type}</p>
            <p>Format: {session.format}</p>
            <p>Status: {session.status}</p>
          </div>

          <div>
            <h3 className="font-semibold">Treatment Details</h3>
            <p>Session Number: {session.sessionNumber}</p>
            <p>Treatment Focus: {session.treatmentFocus}</p>
            {session.notes && <p>Notes: {session.notes}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
