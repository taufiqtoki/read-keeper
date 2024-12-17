import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { openDB } from 'idb';

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadstart = () => setUploadProgress(0);
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };
      
      reader.onload = async (e) => {
        try {
          const db = await initDB();
          await db.put('pdf', e.target?.result, 'bookPdf');
          setCurrentFile("Current PDF");
          setUploadProgress(100);
          toast.success("PDF uploaded successfully!");
        } catch (error) {
          console.error('Error storing PDF:', error);
          toast.error("Failed to store PDF. The file might be too large.");
        }
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error("Failed to read the PDF file");
    }
  };

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
        <div className="space-y-4">
          <Input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="mb-4"
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Progress value={uploadProgress} className="w-full" />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg">{currentFile}</span>
            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete PDF
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteFile}
                >
                  <Check className="w-4 h-4" />
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};