// WARNING: Using div-based modal to avoid shadcn Dialog freezing issues
// DO NOT replace with shadcn Dialog component

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useModalAccessibility, useScreenReaderAnnouncement } from "@/hooks/use-modal-accessibility";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Video,
  Phone,
  Edit,
  Copy,
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
} from "lucide-react";
import moment from "moment";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    clientId: string;
    clientName: string;
    clientEmail: string;
    sessionType: "Individual" | "Couples" | "Family" | "Group";
    format: "In-Person" | "Telehealth" | "Phone";
    status: "Confirmed" | "Pending" | "Completed" | "Cancelled" | "No-Show";
    diagnosis: string;
    notes?: string;
    sessionNumber: number;
    duration: number;
    rate: number;
  };
}

interface EventDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
  onEventAction?: (action: string, event: CalendarEvent) => void;
}

export function EventDetailsModal({
  open,
  onOpenChange,
  event,
  onEventAction,
}: EventDetailsModalProps) {
  const { modalRef } = useModalAccessibility({
    isOpen: open,
    onClose: () => onOpenChange(false),
  });
  const { announce } = useScreenReaderAnnouncement();

  if (!open || !event) return null;

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Confirmed":
        return { icon: CheckCircle, color: "text-green-600" };
      case "Pending":
        return { icon: Clock, color: "text-yellow-600" };
      case "Completed":
        return { icon: CheckCircle, color: "text-blue-600" };
      case "Cancelled":
        return { icon: XCircle, color: "text-red-600" };
      case "No-Show":
        return { icon: AlertCircle, color: "text-orange-600" };
      default:
        return { icon: Clock, color: "text-gray-600" };
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "In-Person":
        return MapPin;
      case "Telehealth":
        return Video;
      case "Phone":
        return Phone;
      default:
        return MapPin;
    }
  };

  const StatusIcon = getStatusInfo(event.resource.status).icon;
  const FormatIcon = getFormatIcon(event.resource.format);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="modal-title" className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            {event.resource.clientName}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close event details"
            type="button"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div id="modal-description" className="p-6 space-y-6">
          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-semibold text-gray-800">
                Date & Time
              </Label>
              <div className="bg-gray-50 p-3 rounded-lg mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">
                    {moment(event.start).format("MMMM Do, YYYY")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">
                    {moment(event.start).format("h:mm A")} -{" "}
                    {moment(event.end).format("h:mm A")}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-800">
                Session Details
              </Label>
              <div className="bg-gray-50 p-3 rounded-lg mt-2 space-y-2">
                <Badge variant="outline" className="text-xs">
                  {event.resource.sessionType} Therapy
                </Badge>
                <div className="flex items-center gap-2">
                  <FormatIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{event.resource.format}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon
                    className={`h-4 w-4 ${getStatusInfo(event.resource.status).color}`}
                  />
                  <span className="text-sm">{event.resource.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <Label className="text-sm font-semibold text-gray-800">
              Diagnosis
            </Label>
            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-200 mt-2">
              <p className="text-sm text-gray-700">
                {event.resource.diagnosis}
              </p>
            </div>
          </div>

          {/* Notes */}
          {event.resource.notes && (
            <div>
              <Label className="text-sm font-semibold text-gray-800">
                Session Notes
              </Label>
              <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-200 mt-2">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {event.resource.notes}
                </p>
              </div>
            </div>
          )}

          {/* Session Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-gray-600">
                Session #
              </Label>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {event.resource.sessionNumber}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-gray-600">
                Duration
              </Label>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {event.resource.duration} min
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-gray-600">Rate</Label>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                ${event.resource.rate}
              </p>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex flex-wrap gap-2 justify-end">
            {onEventAction && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onEventAction("edit", event);
                    announce(`Editing appointment for ${event.resource.clientName}`);
                    handleClose();
                  }}
                  aria-label={`Edit appointment for ${event.resource.clientName}`}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onEventAction("duplicate", event);
                    announce(`Duplicating appointment for ${event.resource.clientName}`);
                    handleClose();
                  }}
                  aria-label={`Duplicate appointment for ${event.resource.clientName}`}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                {event.resource.status === "Confirmed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onEventAction("complete", event);
                      handleClose();
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onEventAction("cancel", event);
                    handleClose();
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onEventAction("delete", event);
                    handleClose();
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
            <Button onClick={handleClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
