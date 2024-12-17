import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DeleteConfirmation } from "./DeleteConfirmation";

interface PDFDisplayProps {
  currentFile: string;
  showDeleteConfirm: boolean;
  onDeleteClick: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

export const PDFDisplay = ({
  currentFile,
  showDeleteConfirm,
  onDeleteClick,
  onConfirmDelete,
  onCancelDelete
}: PDFDisplayProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-lg">{currentFile}</span>
        {!showDeleteConfirm ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteClick}
          >
            <Trash2 className="w-4 h-4" />
            Delete PDF
          </Button>
        ) : (
          <DeleteConfirmation
            onConfirm={onConfirmDelete}
            onCancel={onCancelDelete}
          />
        )}
      </div>
    </div>
  );
};