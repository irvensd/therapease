import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Video,
  User,
  FileText,
  Target,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";

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

  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "completed":
        return "secondary";
      case "pending":
        return "outline";
      case "cancelled":
        return "destructive";
      case "no-show":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: Session["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "cancelled":
        return <XCircle className="h-3 w-3" />;
      case "no-show":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getFormatIcon = (format: Session["format"]) => {
    switch (format) {
      case "In-Person":
        return <MapPin className="h-4 w-4" />;
      case "Telehealth":
        return <Video className="h-4 w-4" />;
      case "Phone Call":
        return <Phone className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Session Details - {session.clientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Session Overview
                <Badge
                  variant={getStatusColor(session.status)}
                  className="flex items-center gap-1"
                >
                  {getStatusIcon(session.status)}
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{formatDate(session.date)}</div>
                      <div className="text-sm text-muted-foreground">Session Date</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{session.time}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.duration} minutes
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getFormatIcon(session.format)}
                    <div>
                      <div className="font-medium">{session.format}</div>
                      <div className="text-sm text-muted-foreground">Session Format</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{session.type}</div>
                      <div className="text-sm text-muted-foreground">
                        Session #{session.sessionNumber}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{session.treatmentFocus}</div>
                      <div className="text-sm text-muted-foreground">Treatment Focus</div>
                    </div>
                  </div>

                  {session.isRecurring && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Recurring Session</div>
                        <div className="text-sm text-muted-foreground">
                          Part of ongoing treatment
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="font-medium text-lg">{session.clientName}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Client ID: {session.clientId}
                  </div>
                  {session.diagnosis && (
                    <Badge variant="outline" className="text-xs">
                      {session.diagnosis}
                    </Badge>
                  )}
                </div>
                {session.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{session.location}</div>
                      <div className="text-sm text-muted-foreground">Location</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Session Notes */}
          {session.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Session Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{session.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Session ID: {session.id}
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onEdit(session);
                    onOpenChange(false);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Session
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(session);
                    onOpenChange(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Session
                </Button>
              )}
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
