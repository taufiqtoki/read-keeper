import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { openDB } from 'idb';

interface PDFUploaderProps {
  setCurrentFile: (file: string | null) => void;
  uploadProgress: number;
  setUploadProgress: (progress: number) => void;
}

export const PDFUploader = ({ setCurrentFile, uploadProgress, setUploadProgress }: PDFUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
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
          const db = await openDB('bookDB', 1, {
            upgrade(db) {
              if (!db.objectStoreNames.contains('pdf')) {
                db.createObjectStore('pdf');
              }
            },
          });
          await db.put('pdf', e.target?.result, 'bookPdf');
          setCurrentFile("Current PDF");
          setUploadProgress(100);
          toast.success("PDF uploaded successfully!");
          setSelectedFile(null);
        } catch (error) {
          console.error('Error storing PDF:', error);
          toast.error("Failed to store PDF. The file might be too large.");
        }
      };
      
      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error("Failed to read the PDF file");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <Input
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
          className="mb-2"
        />
        {selectedFile && (
          <div className="text-sm text-muted-foreground">
            Selected file: {selectedFile.name}
          </div>
        )}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload PDF
        </Button>
      </div>
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Progress value={uploadProgress} className="w-full" />
      )}
    </div>
  );
};