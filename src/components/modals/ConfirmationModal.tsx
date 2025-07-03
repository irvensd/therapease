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
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Clock,
  Zap,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  type?: "success" | "warning" | "info" | "error" | "wellness";
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  autoClose?: number; // Auto close after X milliseconds
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  message,
  type = "info",
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  showCancel = false,
  autoClose,
}: ConfirmationModalProps) {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (open && autoClose) {
      setCountdown(Math.ceil(autoClose / 1000));
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev && prev <= 1) {
            clearInterval(timer);
            onOpenChange(false);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [open, autoClose, onOpenChange]);

  const getTypeConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "warning":
        return {
          icon: AlertCircle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "error":
        return {
          icon: X,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "wellness":
        return {
          icon: Heart,
          color: "text-pink-600",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-200",
        };
      default:
        return {
          icon: Info,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
    }
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-full",
                config.bgColor,
                config.borderColor,
                "border",
              )}
            >
              <IconComponent className={cn("h-5 w-5", config.color)} />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left">{title}</DialogTitle>
              {countdown && (
                <Badge variant="outline" className="mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Auto-close in {countdown}s
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <DialogDescription className="text-left pt-2">
          {message}
        </DialogDescription>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {showCancel && (
            <Button variant="outline" onClick={handleCancel}>
              {cancelLabel}
            </Button>
          )}
          <Button onClick={handleConfirm} className="w-full sm:w-auto">
            {confirmLabel}
            {type === "wellness" && <Heart className="ml-2 h-4 w-4" />}
            {type === "success" && <CheckCircle className="ml-2 h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for easier usage
export function useConfirmationModal() {
  const [modalState, setModalState] = useState<{
    open: boolean;
    title: string;
    message: string;
    type?: "success" | "warning" | "info" | "error" | "wellness";
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
    autoClose?: number;
  }>({
    open: false,
    title: "",
    message: "",
  });

  const showModal = (config: Omit<typeof modalState, "open">) => {
    setModalState({ ...config, open: true });
  };

  const hideModal = () => {
    setModalState((prev) => ({ ...prev, open: false }));
  };

  const ModalComponent = () => (
    <ConfirmationModal
      {...modalState}
      onOpenChange={(open) => {
        if (!open) hideModal();
      }}
    />
  );

  return {
    showModal,
    hideModal,
    ModalComponent,
  };
}
