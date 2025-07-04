import { useState, useCallback, useEffect } from "react";
import jsPDF from "jspdf";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Send,
  Download,
  Loader2,
  FileText,
  Mail,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";

interface Invoice {
  id: number;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  services: InvoiceService[];
  notes?: string;
  isStarred: boolean;
  paymentMethod?: string;
  lateFee?: number;
  discountAmount?: number;
  taxAmount: number;
  totalAmount: number;
}

interface InvoiceService {
  description: string;
  quantity: number;
  rate: number;
  total: number;
  date: string;
}

interface SendInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onInvoiceSent: (invoiceId: number) => void;
}

export function SendInvoiceModal({
  open,
  onOpenChange,
  invoice,
  onInvoiceSent,
}: SendInvoiceModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  // Update email data when invoice changes
  useEffect(() => {
    if (invoice) {
      setEmailData({
        to: invoice.clientEmail,
        subject: `Invoice ${invoice.invoiceNumber} - TherapEase`,
        message: `Dear ${invoice.clientName},

Please find attached your invoice ${invoice.invoiceNumber} for therapy services.

Invoice Details:
- Invoice Number: ${invoice.invoiceNumber}
- Amount Due: $${invoice.totalAmount.toFixed(2)}
- Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

Payment can be made by check, cash, or credit card during your next session, or you may contact our office to arrange payment.

Thank you for choosing TherapEase for your therapy needs.

Best regards,
TherapEase Team`,
      });
    }
  }, [invoice]);

  const generatePDF = useCallback((invoice: Invoice) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;

    // Header
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("TherapEase", margin, yPosition);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("Professional Therapy Services", margin, yPosition + 8);
    pdf.text(
      "Phone: (555) 123-4567 | Email: billing@therapease.com",
      margin,
      yPosition + 16,
    );

    // Invoice title and number
    yPosition += 40;
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("INVOICE", margin, yPosition);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 80, yPosition);
    pdf.text(
      `Date: ${new Date(invoice.issueDate).toLocaleDateString()}`,
      pageWidth - 80,
      yPosition + 8,
    );
    pdf.text(
      `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
      pageWidth - 80,
      yPosition + 16,
    );

    // Bill to
    yPosition += 30;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Bill To:", margin, yPosition);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(invoice.clientName, margin, yPosition + 10);
    pdf.text(invoice.clientEmail, margin, yPosition + 18);

    // Status badge
    yPosition += 35;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    const statusColor =
      invoice.status === "Paid"
        ? [0, 150, 0]
        : invoice.status === "Overdue"
          ? [200, 0, 0]
          : [100, 100, 100];
    pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    pdf.text(`Status: ${invoice.status}`, margin, yPosition);
    pdf.setTextColor(0, 0, 0);

    // Services table header
    yPosition += 20;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Description", margin, yPosition);
    pdf.text("Date", margin + 80, yPosition);
    pdf.text("Qty", margin + 120, yPosition);
    pdf.text("Rate", margin + 140, yPosition);
    pdf.text("Total", margin + 160, yPosition);

    // Draw line under header
    pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

    // Services
    yPosition += 10;
    pdf.setFont("helvetica", "normal");
    let subtotal = 0;

    invoice.services.forEach((service) => {
      pdf.text(service.description.substring(0, 35), margin, yPosition);
      pdf.text(
        new Date(service.date).toLocaleDateString(),
        margin + 80,
        yPosition,
      );
      pdf.text(service.quantity.toString(), margin + 120, yPosition);
      pdf.text(`$${service.rate.toFixed(2)}`, margin + 140, yPosition);
      pdf.text(`$${service.total.toFixed(2)}`, margin + 160, yPosition);
      subtotal += service.total;
      yPosition += 8;
    });

    // Totals section
    yPosition += 10;
    pdf.line(margin + 140, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    pdf.text("Subtotal:", margin + 120, yPosition);
    pdf.text(`$${subtotal.toFixed(2)}`, margin + 160, yPosition);
    yPosition += 8;

    if (invoice.discountAmount && invoice.discountAmount > 0) {
      pdf.text("Discount:", margin + 120, yPosition);
      pdf.text(
        `-$${invoice.discountAmount.toFixed(2)}`,
        margin + 160,
        yPosition,
      );
      yPosition += 8;
    }

    pdf.text("Tax:", margin + 120, yPosition);
    pdf.text(`$${invoice.taxAmount.toFixed(2)}`, margin + 160, yPosition);
    yPosition += 8;

    if (invoice.lateFee && invoice.lateFee > 0) {
      pdf.setTextColor(200, 0, 0);
      pdf.text("Late Fee:", margin + 120, yPosition);
      pdf.text(`$${invoice.lateFee.toFixed(2)}`, margin + 160, yPosition);
      pdf.setTextColor(0, 0, 0);
      yPosition += 8;
    }

    // Total amount
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Total Amount:", margin + 120, yPosition);
    pdf.text(`$${invoice.totalAmount.toFixed(2)}`, margin + 160, yPosition);

    // Payment info
    yPosition += 30;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Payment Methods: Cash, Check, Credit Card", margin, yPosition);
    pdf.text(
      "Please make checks payable to: TherapEase",
      margin,
      yPosition + 8,
    );

    if (invoice.notes) {
      yPosition += 20;
      pdf.setFont("helvetica", "bold");
      pdf.text("Notes:", margin, yPosition);
      pdf.setFont("helvetica", "normal");
      const noteLines = pdf.splitTextToSize(
        invoice.notes,
        pageWidth - 2 * margin,
      );
      pdf.text(noteLines, margin, yPosition + 8);
    }

    // Footer
    yPosition = pdf.internal.pageSize.getHeight() - 20;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      "Thank you for choosing TherapEase for your therapy needs.",
      pageWidth / 2,
      yPosition,
      { align: "center" },
    );

    return pdf;
  }, []);

  const handleDownloadPDF = useCallback(() => {
    if (!invoice) return;

    try {
      const pdf = generatePDF(invoice);
      pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);

      toast({
        title: "PDF Downloaded",
        description: `Invoice ${invoice.invoiceNumber} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  }, [invoice, generatePDF, toast]);

  const handleSendEmail = useCallback(async () => {
    if (!invoice || !emailData.to.trim()) return;

    setIsLoading(true);

    try {
      // Generate PDF blob for email attachment
      const pdf = generatePDF(invoice);
      const pdfBlob = pdf.output("blob");

      // Simulate email sending with delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, you would send the email here with the PDF attachment
      // For now, we'll simulate success

      onInvoiceSent(invoice.id);

      toast({
        title: "Invoice Sent Successfully",
        description: `Invoice ${invoice.invoiceNumber} has been sent to ${emailData.to}`,
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Send Failed",
        description:
          "There was an error sending the invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [invoice, emailData, generatePDF, onInvoiceSent, onOpenChange, toast]);

  const handleInputChange = (field: string, value: string) => {
    setEmailData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Invoice {invoice.invoiceNumber}
          </DialogTitle>
          <DialogDescription>
            Send this invoice to your client via email with a PDF attachment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Preview */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Invoice Preview
              </h3>
              <Badge
                variant={invoice.status === "Paid" ? "default" : "secondary"}
              >
                {invoice.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{invoice.clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{invoice.clientEmail}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">
                    ${invoice.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Due: {new Date(invoice.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Email Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-to">To</Label>
              <Input
                id="email-to"
                type="email"
                value={emailData.to}
                onChange={(e) => handleInputChange("to", e.target.value)}
                placeholder="client@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={emailData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Invoice subject"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email-message">Message</Label>
              <Textarea
                id="email-message"
                value={emailData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Email message..."
                rows={8}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isLoading || !emailData.to.trim()}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isLoading ? "Sending..." : "Send Invoice"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
