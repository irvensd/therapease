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

interface CreateInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInvoiceModal({
  open,
  onOpenChange,
}: CreateInvoiceModalProps) {
  const [formData, setFormData] = useState({
    client: "",
    services: [{ description: "", quantity: "1", rate: "", amount: "" }],
    issueDate: "",
    dueDate: "",
    notes: "",
    taxRate: "0",
  });

  const addService = () => {
    setFormData({
      ...formData,
      services: [
        ...formData.services,
        { description: "", quantity: "1", rate: "", amount: "" },
      ],
    });
  };

  const updateService = (index: number, field: string, value: string) => {
    const updatedServices = formData.services.map((service, i) => {
      if (i === index) {
        const updatedService = { ...service, [field]: value };
        if (field === "quantity" || field === "rate") {
          const quantity = parseFloat(updatedService.quantity) || 0;
          const rate = parseFloat(updatedService.rate) || 0;
          updatedService.amount = (quantity * rate).toFixed(2);
        }
        return updatedService;
      }
      return service;
    });
    setFormData({ ...formData, services: updatedServices });
  };

  const removeService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index),
    });
  };

  const calculateTotal = () => {
    const subtotal = formData.services.reduce(
      (sum, service) => sum + (parseFloat(service.amount) || 0),
      0,
    );
    const tax = (subtotal * parseFloat(formData.taxRate)) / 100;
    return (subtotal + tax).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New invoice data:", {
      ...formData,
      total: calculateTotal(),
    });

    setFormData({
      client: "",
      services: [{ description: "", quantity: "1", rate: "", amount: "" }],
      issueDate: "",
      dueDate: "",
      notes: "",
      taxRate: "0",
    });
    onOpenChange(false);

    alert("Invoice created successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Generate an invoice for therapy services provided.
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, issueDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Services</Label>
                <Button type="button" onClick={addService} size="sm">
                  Add Service
                </Button>
              </div>

              {formData.services.map((service, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-center p-2 border rounded"
                >
                  <Input
                    placeholder="Service description"
                    value={service.description}
                    onChange={(e) =>
                      updateService(index, "description", e.target.value)
                    }
                    className="col-span-5"
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={service.quantity}
                    onChange={(e) =>
                      updateService(index, "quantity", e.target.value)
                    }
                    className="col-span-2"
                    min="1"
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Rate"
                    value={service.rate}
                    onChange={(e) =>
                      updateService(index, "rate", e.target.value)
                    }
                    className="col-span-2"
                    step="0.01"
                    required
                  />
                  <Input
                    placeholder="Amount"
                    value={service.amount}
                    readOnly
                    className="col-span-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeService(index)}
                    className="col-span-1"
                    disabled={formData.services.length === 1}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taxRate" className="text-right">
                Tax Rate (%)
              </Label>
              <Input
                id="taxRate"
                type="number"
                value={formData.taxRate}
                onChange={(e) =>
                  setFormData({ ...formData, taxRate: e.target.value })
                }
                className="col-span-1"
                step="0.01"
                min="0"
                max="100"
              />
              <div className="col-span-2 text-right">
                <span className="font-bold">Total: ${calculateTotal()}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right mt-2">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="col-span-3"
                placeholder="Additional notes or payment instructions..."
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
            <Button type="submit">Create Invoice</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
