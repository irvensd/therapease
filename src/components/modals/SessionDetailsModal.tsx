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
        <div className="p-6 space-y-6">
          {/* Client Info */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-gray-800">{session.clientName}</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Date:</span>
                  <span className="text-gray-800">{session.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Time:</span>
                  <span className="text-gray-800">{session.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Duration:</span>
                  <span className="text-gray-800">{session.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Type:</span>
                  <span className="text-gray-800">{session.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Format:</span>
                  <span className="text-gray-800">{session.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className={`capitalize font-medium ${
                    session.status === 'confirmed' ? 'text-green-600' :
                    session.status === 'completed' ? 'text-blue-600' :
                    session.status === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>{session.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Session #:</span>
                  <span className="text-gray-800">{session.sessionNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Client ID:</span>
                  <span className="text-gray-800">{session.clientId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Focus */}
          <div>
            <h4 className="font-semibold text-lg mb-2 text-gray-800">Treatment Focus</h4>
            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-200">
              <p className="text-sm text-gray-700">{session.treatmentFocus}</p>
            </div>
          </div>

          {/* Notes */}
          {session.notes && (
            <div>
              <h4 className="font-semibold text-lg mb-2 text-gray-800">Session Notes</h4>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-200">
                <p className="text-sm text-gray-700 leading-relaxed">{session.notes}</p>
              </div>
            </div>
          )}

          {/* Location */}
          {session.location && (
            <div>
              <h4 className="font-semibold text-lg mb-2 text-gray-800">Location</h4>
              <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-200">
                <p className="text-sm text-gray-700">{session.location}</p>
              </div>
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
