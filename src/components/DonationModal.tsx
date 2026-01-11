"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UnifiedDonationForm } from "@/components/donations/UnifiedDonationForm";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: {
    id: string;
    title: string;
  } | null;
}

export function DonationModal({ open, onOpenChange, campaign }: DonationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-primary to-primary-hover p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {campaign ? `Donate to ${campaign.title}` : "Make a Donation"}
            </DialogTitle>
            <DialogDescription className="text-white/80 mt-1">
              Your contribution makes a real difference.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <UnifiedDonationForm
            variant="modal"
            initialCampaignId={campaign?.id}
            initialCampaignTitle={campaign?.title}
            onClose={() => onOpenChange(false)}
            showCauseSelector={!campaign} // Hide selector if campaign is pre-selected
            showImpactCards={false} // Simplify for specific campaign donation
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
