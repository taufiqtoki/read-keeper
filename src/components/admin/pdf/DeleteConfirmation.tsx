import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmation = ({ onConfirm, onCancel }: DeleteConfirmationProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="destructive"
        size="sm"
        onClick={onConfirm}
      >
        <Check className="w-4 h-4" />
        Confirm
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onCancel}
      >
        <X className="w-4 h-4" />
        Cancel
      </Button>
    </div>
  );
};