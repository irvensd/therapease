// WARNING: DO NOT replace this simple div-based modal with shadcn Dialog component
// The shadcn Dialog component causes app freezing issues when closing modals
// This simple implementation works reliably - keep it as is!

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
}: SessionDetailsModalProps) {
  if (!open || !session) return null;

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Session Details</h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{session.clientName}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Date:</span> {session.date}
              </div>
              <div>
                <span className="text-gray-600">Time:</span> {session.time}
              </div>
              <div>
                <span className="text-gray-600">Duration:</span> {session.duration} minutes
              </div>
              <div>
                <span className="text-gray-600">Type:</span> {session.type}
              </div>
              <div>
                <span className="text-gray-600">Format:</span> {session.format}
              </div>
              <div>
                <span className="text-gray-600">Status:</span> {session.status}
              </div>
              <div>
                <span className="text-gray-600">Session #:</span> {session.sessionNumber}
              </div>
              <div>
                <span className="text-gray-600">Client ID:</span> {session.clientId}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-1">Treatment Focus</h4>
            <p className="text-sm text-gray-700">{session.treatmentFocus}</p>
          </div>

          {session.notes && (
            <div>
              <h4 className="font-medium mb-1">Notes</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{session.notes}</p>
            </div>
          )}

          {session.location && (
            <div>
              <h4 className="font-medium mb-1">Location</h4>
              <p className="text-sm text-gray-700">{session.location}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 border-t">
          {onEdit && (
            <button
              onClick={() => {
                onEdit(session);
                handleClose();
              }}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
