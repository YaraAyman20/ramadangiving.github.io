"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UnifiedDonationForm } from "@/components/donations/UnifiedDonationForm";

interface SmartDonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SmartDonationModal({ open, onOpenChange }: SmartDonationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-primary to-primary-hover p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Make a Donation
            </DialogTitle>
            <DialogDescription className="text-white/80 mt-1">
              Your generosity transforms lives. Every dollar counts.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <UnifiedDonationForm
            variant="modal"
            onClose={() => onOpenChange(false)}
            onComplete={() => {
              // Optional: Close modal after delay or let user close it manually via the "Done" button in the form
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
