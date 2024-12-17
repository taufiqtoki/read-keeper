import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { openDB } from 'idb';
import { PDFUploader } from "./pdf/PDFUploader";
import { PDFDisplay } from "./pdf/PDFDisplay";

// Initialize the IndexedDB database
const initDB = async () => {
  return openDB('bookDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('pdf')) {
        db.createObjectStore('pdf');
      }
    },
  });
};

export const PDFManagement = ({
  currentFile,
  setCurrentFile,
  uploadProgress,
  setUploadProgress,
}: {
  currentFile: string | null;
  setCurrentFile: (file: string | null) => void;
  uploadProgress: number;
  setUploadProgress: (progress: number) => void;
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteFile = async () => {
    try {
      const db = await initDB();
      await db.delete('pdf', 'bookPdf');
      localStorage.removeItem("currentPage");
      setCurrentFile(null);
      setShowDeleteConfirm(false);
      toast.success("PDF deleted successfully");
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error("Failed to delete PDF");
    }
  };

  return (
    <Card className="p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Upload className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-serif">PDF Management</h2>
      </div>
      
      {!currentFile ? (
        <PDFUploader
          setCurrentFile={setCurrentFile}
          uploadProgress={uploadProgress}
          setUploadProgress={setUploadProgress}
        />
      ) : (
        <PDFDisplay
          currentFile={currentFile}
          showDeleteConfirm={showDeleteConfirm}
          onDeleteClick={() => setShowDeleteConfirm(true)}
          onConfirmDelete={handleDeleteFile}
          onCancelDelete={() => setShowDeleteConfirm(false)}
        />
      )}
    </Card>
  );
};